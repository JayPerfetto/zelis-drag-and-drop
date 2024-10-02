import { useState, useEffect, useCallback } from "react";
import {
  Form,
  useActionData,
  useNavigation,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import {
  S3Client,
  ListObjectsV2Command,
  // GetObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { FileList } from "~/components/FileList";
import { FileInfo } from "~/types/types";
import { useDropzone } from "react-dropzone-esm";

const BUCKET_NAME = "drag-n-drop-site-zelis";

const s3Client = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY!,
  },
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const fileName = url.searchParams.get("fileName");

  if (fileName) {
    // const params = {
    //   Bucket: BUCKET_NAME,
    //   Key: fileName,
    // };

    // File Download
    try {
      console.log(fileName);
      //   const { Body, ContentType, ContentLength } = await s3Client.send(
      //     new GetObjectCommand(params)
      //   );

      //   if (Body instanceof Readable) {
      //     const stream = Body;
      //     const headers = new Headers({
      //       "Content-Disposition": `attachment; filename="${fileName}"`,
      //       "Content-Type": ContentType || "application/octet-stream",
      //       "Content-Length": ContentLength?.toString() || "",
      //     });

      //     return new Response(stream as any, { headers });
      //   } else {
      //     throw new Error("Invalid response body");
      //   }
      // } catch (err) {
      //   console.error("Error downloading file:", err);
      //   throw new Response("Error downloading file", { status: 500 });
      // }
    } catch (err) {
      console.error("Error downloading file:", err);
    }
  } else {
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
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  // File Upload
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return json({ error: "No file uploaded" }, { status: 400 });
  }

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
};

export default function Index() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [files, setFiles] = useState<FileInfo[]>(loaderData.files || []);

  useEffect(() => {
    if (loaderData.files) {
      setFiles(loaderData.files);
    }
  }, [loaderData]);

  const submit = useSubmit();

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append("file", file);
      });
      submit(formData, { method: "post", encType: "multipart/form-data" });
    },
    [submit]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <header className="bg-primary text-primary-foreground w-full p-4 overflow">
        <h1>Header</h1>
      </header>
      <div className="flex flex-col items-center justify-center">
        <h1>File Upload and List</h1>
        <Form method="post" encType="multipart/form-data">
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-500 p-10 rounded-md">
            <input {...getInputProps()} />
            <p className="text-center">
              Drag n drop some files here, or click to select files
            </p>
          </div>
          {/* <button type="submit" disabled={navigation.state === "submitting"}>
            {navigation.state === "submitting" ? "Uploading..." : "Upload File"}
          </button> */}
        </Form>
        {actionData?.error && (
          <p style={{ color: "red" }}>{actionData.error}</p>
        )}
        {actionData?.success && (
          <p style={{ color: "green" }}>File uploaded successfully!</p>
        )}
        <h2>Files in S3 Bucket</h2>
        <FileList files={files} />
      </div>
    </div>
  );
}
