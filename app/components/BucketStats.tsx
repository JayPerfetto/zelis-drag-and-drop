import { FileInfo } from "~/types/types";
import { Card, CardContent } from "./ui/card";
import { formatFileSize } from "~/utils/formatFileSize";

const BucketStats = ({
  files,
  className,
}: {
  files: FileInfo[];
  className?: string;
}) => {
  return (
    <Card className={`w-full md:p-6 pt-6 md:pt-10 ${className}`}>
      <CardContent className="flex flex-col justify-center space-y-4">
        <h1 className="text-2xl font-bold">Bucket Stats</h1>
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-xl font-bold">Total Files</h2>
            <p className="font-light">{files.length} Files</p>
          </div>
          <div>
            <h2 className="text-xl font-bold">Total Size</h2>
            <p className="font-light">
              {formatFileSize(files.reduce((acc, file) => acc + file.size, 0))}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold">Biggest File</h2>
            <p className="font-light">
              {(() => {
                const biggestFile = files.reduce(
                  (max, file) => (file.size > max.size ? file : max),
                  files[0] || { name: "N/A", size: 0 }
                );
                return `${
                  biggestFile.name.length > 17
                    ? biggestFile.name.substring(0, 17) + "..."
                    : biggestFile.name
                } (${formatFileSize(biggestFile.size)})`;
              })()}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold">File Types</h2>
            <p className="font-light">
              {(() => {
                const typeCount = files.reduce((acc, file) => {
                  const extension =
                    file.name.split(".").pop()?.toLowerCase() || "unknown";
                  acc[extension] = (acc[extension] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                const typeEntries = Object.entries(typeCount);

                if (typeEntries.length === 0) {
                  return "None";
                }

                return typeEntries
                  .map(([type, count]) => `${type} (${count})`)
                  .join(", ");
              })()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BucketStats;
