import { FileInfo } from "~/types/types";
import { Card, CardContent } from "./ui/card";
import { formatFileSize } from "~/utils/formatFileSize";

const BucketStats = ({ files }: { files: FileInfo[] }) => {
  return (
    <Card className="w-full md:max-w-80 md:p-6 pt-6 md:pt-10">
      <CardContent className="flex flex-col justify-center space-y-4">
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-2xl font-bold">Total Files</h2>
            <p className="text-lg">{files.length}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Total File Size</h2>
            <p className="text-lg">
              {formatFileSize(files.reduce((acc, file) => acc + file.size, 0))}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Biggest File</h2>
            <p className="text-lg">
              {formatFileSize(
                files.reduce((acc, file) => Math.max(acc, file.size), 0)
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BucketStats;
