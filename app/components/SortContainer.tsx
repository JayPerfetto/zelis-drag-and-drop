import { FileInfo } from "~/types/types";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "./ui/button";
import { useEffect } from "react";

const SortContainer = ({
  files,
  className,
  sortableFileTypes,
  setSortableFileTypes,
}: {
  files: FileInfo[];
  className?: string;
  sortableFileTypes: string[];
  setSortableFileTypes: (types: string[]) => void;
}) => {
  useEffect(() => {
    setSortableFileTypes([...new Set(files.map((file) => file.type))]);
  }, [files, setSortableFileTypes]);

  const handleSort = (fileType: string) => {
    if (sortableFileTypes.includes(fileType)) {
      setSortableFileTypes(
        sortableFileTypes.filter((type) => type !== fileType)
      );
    } else {
      setSortableFileTypes([...sortableFileTypes, fileType]);
    }
  };

  return (
    <Card className={`w-full md:p-6 pt-6 md:pt-10 ${className}`}>
      <CardContent className="flex flex-col justify-center space-y-4">
        <h1 className="text-2xl font-bold">Sort Container</h1>
        {files.length === 0 ? (
          <p>Please upload a file</p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {[...new Set(files.map((file) => file.type))].map((type) => (
              <Button
                className={`${
                  sortableFileTypes.includes(type)
                    ? ""
                    : "bg-neutral-300 text-muted-foreground"
                }`}
                key={type}
                onClick={() => handleSort(type)}>
                .{type}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SortContainer;
