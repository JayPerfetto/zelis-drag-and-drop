// s3Service.ts
import {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";

const BUCKET_NAME = "drag-n-drop-site-zelis-us-east-1";

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY!,
  },
});

// List files
export const listFiles = async () => {
  const params = { Bucket: BUCKET_NAME };
  try {
    const data = await s3Client.send(new ListObjectsCommand(params));
    return (
      data.Contents?.map((file) => ({
        name: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
      })) || []
    );
  } catch (err) {
    throw new Error(err.message || "Failed to list files");
  }
};

// Upload file
export const uploadFile = async (file: File) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: file.name,
    Body: file.stream(),
  };

  const upload = new Upload({ client: s3Client, params });

  try {
    await upload.done();
    return { success: true, fileName: file.name };
  } catch (error) {
    throw new Error("File upload failed");
  }
};

// Delete file
export const deleteFile = async (fileName: string) => {
  const params = { Bucket: BUCKET_NAME, Key: fileName };
  try {
    await s3Client.send(new DeleteObjectCommand(params));
    return { success: true };
  } catch (err) {
    throw new Error("Failed to delete file");
  }
};

// Get pre-signed URL for download
export const getPreSignedUrl = async (fileName: string) => {
  const params = { Bucket: BUCKET_NAME, Key: fileName };
  try {
    const command = new GetObjectCommand(params);
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (err) {
    throw new Error("Failed to generate pre-signed URL");
  }
};
