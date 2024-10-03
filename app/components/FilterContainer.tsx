import { FileInfo } from "~/types/types";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "./ui/button";
import { useEffect } from "react";

const FilterContainer = ({
  files,
  className,
  filterFileTypes,
  setFilterFileTypes,
}: {
  files: FileInfo[];
  className?: string;
  filterFileTypes: string[];
  setFilterFileTypes: (types: string[]) => void;
}) => {
  useEffect(() => {
    setFilterFileTypes([...new Set(files.map((file) => file.type))]);
  }, [files, setFilterFileTypes]);

  const handleFilter = (fileType: string) => {
    if (filterFileTypes.includes(fileType)) {
      setFilterFileTypes(filterFileTypes.filter((type) => type !== fileType));
    } else {
      setFilterFileTypes([...filterFileTypes, fileType]);
    }
  };

  return (
    <Card className={`w-full md:p-6 pt-6 md:pt-10 ${className}`}>
      <CardContent className="flex flex-col justify-center space-y-4">
        <h1 className="text-2xl font-bold">Sort</h1>
        {files.length === 0 ? (
          <p>Please upload a file</p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {[...new Set(files.map((file) => file.type))].map((type) => (
              <Button
                className={`${
                  filterFileTypes.includes(type)
                    ? ""
                    : "opacity-50 text-muted-foreground"
                }`}
                key={type}
                onClick={() => handleFilter(type)}>
                .{type}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilterContainer;
