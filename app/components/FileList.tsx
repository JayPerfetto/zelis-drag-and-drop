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
import { useEffect, useRef, useState } from "react";
import { formatFileSize } from "~/utils/formatFileSize";
import { Icon } from "@iconify/react";
import { useNavigate } from "@remix-run/react";
import { Skeleton } from "./ui/skeleton";

export const FileList = ({
  files,
  filterFileTypes,
}: {
  files: FileInfo[];
  filterFileTypes: string[];
}) => {
  // Fetcher to handle the file download and delete
  const fetcher = useFetcher();
  // Ref to store the current file being downloaded
  const downloadingFileRef = useRef<string | null>(null);

  // Set the loading to false after 1 second. To give the skeletons a chance to show and not be disruptive
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = async (fileName: string) => {
    downloadingFileRef.current = fileName;
    fetcher.submit({ fileName }, { method: "post" });
  };

  // Function to initiate the download
  const initiateDownload = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    downloadingFileRef.current = null;
  };

  // Effect to initiate the download if the preSignedUrl is available
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

  // Function to truncate the file name
  const truncate = (text: string, length: number) => {
    if (text.length > length) {
      return text.substring(0, length) + "...";
    }
    return text;
  };

  return (
    <div className="w-full space-y-2">
      <h2 className="text-2xl font-bold" id="file-list-title">
        My Files
      </h2>
      <ul className="space-y-4 w-full" aria-labelledby="file-list-title">
        {/* If the files are loading, show the skeletons. Minimum set to 1 second to avoid flickering */}
        {loading ? (
          Array.from({ length: files.length }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-md" />
          ))
        ) : files.length === 0 ? (
          <Card className="flex items-center justify-center" role="alert">
            <CardHeader>
              <CardTitle>Upload a file above...</CardTitle>
            </CardHeader>
          </Card>
        ) : (
          // If the files are not loading, show the files
          files.map((file) => {
            if (filterFileTypes.includes(file.type)) {
              return (
                <Card
                  key={file.name}
                  className="flex items-center justify-between flex-col md:flex-row md:pt-0 pt-4"
                  role="listitem"
                  aria-labelledby={`file-${file.name}`}>
                  <CardHeader>
                    <CardTitle id={`file-${file.name}`}>
                      {truncate(file.name, 25)}
                    </CardTitle>
                    <CardDescription className="font-light">
                      Size: {formatFileSize(file.size)}, Uploaded:{" "}
                      {new Date(file.lastModified).toLocaleString()}, Type: .
                      {file.type}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <div className="flex items-center justify-center w-full md:mt-6 space-x-2">
                      <Button
                        onClick={() => handleDownload(file.name)}
                        aria-label={`Download ${file.name}`}>
                        Download
                      </Button>
                      <Button
                        onClick={() => handleDelete(file.name)}
                        aria-label={`Delete ${file.name}`}
                        className="w-14">
                        <Icon icon="lucide:trash-2" className="w-6 h-6" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            }
          })
        )}
        {/* If the filter file types are empty, show a message to add a type to sort by */}
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
