import { FileInfo } from "~/types/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";

export const FileList = ({ files }: { files: FileInfo[] }) => {
  return (
    <ul className="space-y-4">
      {files.map((file) => (
        <Card key={file.name} className="flex items-center justify-between">
          <CardHeader>
            <CardTitle>{file.name}</CardTitle>
            <CardDescription>
              Size: {(file.size / 1024).toFixed(2)} KB, Uploaded:{" "}
              {new Date(file.lastModified).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center ">
            <div className="flex items-center justify-center w-full">
              {/* TODO: center later */}
              <a
                className="mt-6"
                href={`?fileName=${encodeURIComponent(file.name)}`}
                download>
                <Button>Download</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      ))}
    </ul>
  );
};
