import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import express from "express";
import cors from "cors";
import multer from "multer";

const AWS_ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

const s3Client = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = "drag-n-drop-site-zelis";

app.post("/uploadFile", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const params = {
    Bucket: BUCKET_NAME,
    Key: req.file.originalname,
    Body: req.file.buffer,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    res.status(200).send("File uploaded successfully");
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).send("Error uploading file");
  }
});

app.get("/listFiles", async (req, res) => {
  const params = {
    Bucket: BUCKET_NAME,
  };

  try {
    const data = await s3Client.send(new ListObjectsV2Command(params));
    const fileList = data.Contents.map((file) => ({
      name: file.Key,
      size: file.Size,
      lastModified: file.LastModified,
    }));
    res.status(200).json(fileList);
  } catch (err) {
    console.error("Error listing files:", err);
    res.status(500).send("Error listing files");
  }
});

app.get("/downloadFile", async (req, res) => {
  const { fileName } = req.query;

  if (!fileName) {
    return res.status(400).send("File name is required");
  }

  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
  };

  try {
    const { Body, ContentType } = await s3Client.send(
      new GetObjectCommand(params)
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", ContentType);
    Body.pipe(res);
  } catch (err) {
    console.error("Error downloading file:", err);
    res.status(500).send("Error downloading file");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
