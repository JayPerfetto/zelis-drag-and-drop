import { FileInfo } from "~/types/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import { useMemo, useState } from "react";

export const FileList = ({ files }: { files: FileInfo[] }) => {
  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      const dateA = new Date(a.lastModified).getTime();
      const dateB = new Date(b.lastModified).getTime();
      return dateB - dateA;
    });
  }, [files]);

  return (
    <div className="w-full space-y-2">
      <h2 className="text-2xl font-bold">My Files</h2>
      <ul className="space-y-4 w-full">
        {sortedFiles.map((file) => (
          <Card key={file.name} className="flex items-center justify-between">
            <CardHeader>
              <CardTitle>{file.name}</CardTitle>
              <CardDescription>
                Size: {(file.size / 1024).toFixed(2)} KB, Uploaded:{" "}
                {new Date(file.lastModified).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center ">
              <div className="flex items-center justify-center w-full mt-6">
                {/* TODO: center later */}
                <a href={`?fileName=${encodeURIComponent(file.name)}`} download>
                  <Button>Download</Button>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </ul>
    </div>
  );
};
