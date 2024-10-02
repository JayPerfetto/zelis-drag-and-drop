import { useState, useEffect, useMemo } from "react";
import { useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  SignUrlCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { FileList } from "~/components/FileList";
import { FileInfo } from "~/types/types";
import { DropZone } from "~/components/DropZone";
import { Card, CardContent } from "~/components/ui/card";
import ThreeJS from "~/components/ThreeJS";
import { Readable } from "stream";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

  if (fileName) {
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

  return (
    <main>
      <div className="h-full w-1/3 absolute right-0 hidden lg:block">
        <ThreeJS files={sortedFiles} />
      </div>
      <div className="p-10">
        <Card className="max-w-3xl mx-auto p-6">
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
