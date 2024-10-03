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
import { formatFileSize } from "~/utils/formatFileSize";

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

  const truncate = (text: string, length: number) => {
    if (text.length > length) {
      return text.substring(0, length) + "...";
    }
    return text;
  };

  return (
    <div className="w-full space-y-2">
      <h2 className="text-2xl font-bold">My Files</h2>
      <ul className="space-y-4 w-full">
        {files.length === 0 ? (
          <p className="mt-6 text-center">Upload a file above...</p>
        ) : (
          files.map((file) => (
            <Card
              key={file.name}
              className="flex items-center justify-between flex-col md:flex-row">
              <CardHeader>
                <CardTitle>{truncate(file.name, 25)}</CardTitle>
                <CardDescription>
                  Size: {formatFileSize(file.size)}, Uploaded:{" "}
                  {new Date(file.lastModified).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="flex items-center justify-center w-full md:mt-6">
                  <Button onClick={() => handleDownload(file.name)}>
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </ul>
      <fetcher.Form method="post" />
    </div>
  );
};
