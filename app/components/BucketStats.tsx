import { FileInfo } from "~/types/types";
import { Card, CardContent } from "./ui/card";
import { formatFileSize } from "~/utils/formatFileSize";

const BucketStats = ({ files }: { files: FileInfo[] }) => {
  return (
    <Card className="w-full md:max-w-80 md:p-6 pt-6 md:pt-10">
      <CardContent className="flex flex-col justify-center space-y-4">
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-xl font-bold">Total Files</h2>
            <p className="font-light">{files.length} Files</p>
          </div>
          <div>
            <h2 className="text-xl font-bold">Total File Size</h2>
            <p className="font-light">
              {formatFileSize(files.reduce((acc, file) => acc + file.size, 0))}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold">Biggest File</h2>
            <p className="font-light">
              {(() => {
                const biggestFile = files.reduce(
                  (max, file) =>
                    file.size > max.size
                      ? {
                          ...file,
                          name:
                            file.name.length > 20
                              ? file.name.substring(0, 17) + "..."
                              : file.name,
                        }
                      : max,
                  files[0] || { name: "N/A", size: 0 }
                );
                return `${biggestFile.name} (${formatFileSize(
                  biggestFile.size
                )})`;
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

                return Object.entries(typeCount)
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
