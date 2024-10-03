import { useState, useEffect, useMemo } from "react";
import { useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { FileList } from "~/components/FileList";
import { FileInfo } from "~/types/types";
import { DropZone } from "~/components/DropZone";
import { Card, CardContent } from "~/components/ui/card";
import ThreeJS from "~/components/ThreeJS";
import { Readable } from "stream";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import BucketStats from "~/components/BucketStats";

const BUCKET_NAME = "drag-n-drop-site-zelis";

const s3Client = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY!,
  },
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // List files
  const params = {
    Bucket: BUCKET_NAME,
  };

  try {
    const data = await s3Client.send(new ListObjectsV2Command(params));
    const fileList =
      data.Contents?.map((file) => ({
        name: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
      })) || [];
    return json({ files: fileList });
  } catch (err) {
    console.error("Error listing files:", err);
    throw new Response("Error listing files", { status: 500 });
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const fileName = formData.get("fileName") as string | null;
  const action = formData.get("action") as string | null;

  if (action === "delete" && fileName) {
    // File Deletion
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
    };

    try {
      await s3Client.send(new DeleteObjectCommand(params));
      return json({ success: true, action: "delete" });
    } catch (err) {
      console.error("Error deleting file:", err);
      return json({ error: "Failed to delete file" }, { status: 500 });
    }
  } else if (fileName) {
    // File Download
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
    };

    try {
      const command = new GetObjectCommand(params);
      const preSignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
      });

      return json({ preSignedUrl });
    } catch (err) {
      console.error("Error generating pre-signed URL:", err);
      return json(
        { error: "Failed to generate pre-signed URL" },
        { status: 500 }
      );
    }
  } else if (file) {
    // File Upload
    const params = {
      Bucket: BUCKET_NAME,
      Key: file.name,
      Body: file.stream(),
    };

    try {
      const upload = new Upload({
        client: s3Client,
        params: params,
      });

      await upload.done();
      return json({ success: true, fileName: file.name });
    } catch (error) {
      console.error("Error uploading file:", error);
      return json({ error: "File upload failed" }, { status: 500 });
    }
  } else {
    return json(
      { error: "No file uploaded or specified for download" },
      { status: 400 }
    );
  }
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const [files, setFiles] = useState<FileInfo[]>(() => loaderData.files || []);

  useEffect(() => {
    if (loaderData.files) {
      setFiles(loaderData.files);
    }
  }, [loaderData]);

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      const dateA = new Date(a.lastModified).getTime();
      const dateB = new Date(b.lastModified).getTime();
      return dateB - dateA;
    });
  }, [files]);

  const filesWithTypes = useMemo(() => {
    return sortedFiles.map((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase() || "";
      return { ...file, type: extension };
    });
  }, [sortedFiles]);

  return (
    <main className="overflow-hidden">
      <div className="h-full w-1/3 absolute right-0 hidden xl:block bg-transparent">
        <ThreeJS files={sortedFiles} />
      </div>
      <div className="p-2 mx-auto md:p-10 flex md:flex-row flex-col-reverse items-start justify-start w-full gap-2 md:gap-6">
        <BucketStats files={filesWithTypes} />
        <Card className="w-full max-w-3xl md:p-6 pt-6 md:pt-10">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <DropZone />
            <FileList files={sortedFiles} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

// createRoot(document.getElementById("root")).render(<Index />);
