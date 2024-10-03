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
import { Icon } from "@iconify/react";
import { useNavigate } from "@remix-run/react";

export const FileList = ({
  files,
  filterFileTypes,
}: {
  files: FileInfo[];
  filterFileTypes: string[];
}) => {
  const fetcher = useFetcher();
  const downloadingFileRef = useRef<string | null>(null);
  const navigate = useNavigate();

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

  const handleDelete = async (fileName: string) => {
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
      fetcher.submit({ fileName, action: "delete" }, { method: "post" });
    }
  };

  useEffect(() => {
    if (fetcher.data?.success && fetcher.data.action === "delete") {
      navigate(".", { replace: true });
    }
  }, [fetcher.data, navigate]);

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
          <Card className="flex items-center justify-center">
            <CardHeader>
              <CardTitle>Upload a file above...</CardTitle>
            </CardHeader>
          </Card>
        ) : (
          files.map((file) => {
            if (filterFileTypes.includes(file.type)) {
              return (
                <Card
                  key={file.name}
                  className="flex items-center justify-between flex-col md:flex-row md:pt-0 pt-4">
                  <CardHeader>
                    <CardTitle>{truncate(file.name, 25)}</CardTitle>
                    <CardDescription className="font-light">
                      Size: {formatFileSize(file.size)}, Uploaded:{" "}
                      {new Date(file.lastModified).toLocaleString()}, Type: .
                      {file.type}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <div className="flex items-center justify-center w-full md:mt-6 space-x-2">
                      <Button onClick={() => handleDownload(file.name)}>
                        Download
                      </Button>
                      <Button onClick={() => handleDelete(file.name)}>
                        <Icon icon="mdi:trash" className="w-6 h-6" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            }
          })
        )}
        {filterFileTypes.length === 0 && files.length > 0 && (
          <Card className="flex items-center justify-center">
            <CardHeader>
              <CardTitle>
                No files to display. Please add a type to sort by.
              </CardTitle>
            </CardHeader>
          </Card>
        )}
      </ul>
      <fetcher.Form method="post" />
    </div>
  );
};
