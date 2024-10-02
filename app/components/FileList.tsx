import { FileInfo } from "~/types/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";

export const FileList = ({ files }: { files: FileInfo[] }) => {
  const fetcher = useFetcher();
  const downloadingFileRef = useRef<string | null>(null);

  const handleDownload = async (fileName: string) => {
    downloadingFileRef.current = fileName;
    fetcher.submit({ fileName }, { method: "post" });
  };

  const initiateDownload = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    downloadingFileRef.current = null;
  };

  useEffect(() => {
    if (fetcher.data?.preSignedUrl && downloadingFileRef.current) {
      initiateDownload(fetcher.data.preSignedUrl, downloadingFileRef.current);
    }
  }, [fetcher.data?.preSignedUrl]);

  return (
    <div className="w-full space-y-2">
      <h2 className="text-2xl font-bold">My Files</h2>
      <ul className="space-y-4 w-full">
        {files.map((file) => (
          <Card key={file.name} className="flex items-center justify-between">
            <CardHeader>
              <CardTitle>{file.name}</CardTitle>
              <CardDescription>
                Size:{" "}
                {file.size < 1024 * 1024
                  ? `${(file.size / 1024).toFixed(2)} KB`
                  : file.size < 1024 * 1024 * 1024
                  ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                  : `${(file.size / (1024 * 1024 * 1024)).toFixed(2)} GB`}
                , Uploaded: {new Date(file.lastModified).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="flex items-center justify-center w-full mt-6">
                <Button onClick={() => handleDownload(file.name)}>
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </ul>
      <fetcher.Form method="post" />
    </div>
  );
};
