import { useState, useEffect } from "react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { ActionFunctionArgs, json } from "@remix-run/node";

interface FileInfo {
  name: string;
  size: number;
  lastModified: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    const response = await fetch("http://localhost:3000/uploadFile", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("File upload failed");
    }

    return json({ success: true, fileName: file.name });
  } catch (error) {
    console.error("Error uploading file:", error);
    return json({ error: "File upload failed" }, { status: 500 });
  }
};

export default function Index() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [files, setFiles] = useState<FileInfo[]>([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (actionData?.success) {
      fetchFiles();
    }
  }, [actionData]);

  const fetchFiles = async () => {
    try {
      const response = await fetch("http://localhost:3000/listFiles");
      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  return (
    <div>
      <h1>File Upload and List</h1>
      <Form method="post" encType="multipart/form-data">
        <input type="file" name="file" />
        <button type="submit" disabled={navigation.state === "submitting"}>
          {navigation.state === "submitting" ? "Uploading..." : "Upload File"}
        </button>
      </Form>
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
      {actionData?.success && (
        <p style={{ color: "green" }}>File uploaded successfully!</p>
      )}
      <h2>Files in S3 Bucket</h2>
      <ul>
        {files.map((file) => (
          <li key={file.name}>
            {file.name} - Size: {(file.size / 1024).toFixed(2)} KB, Last
            Modified: {new Date(file.lastModified).toLocaleString()}
            <a
              href={`http://localhost:3000/downloadFile?fileName=${file.name}`}>
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
