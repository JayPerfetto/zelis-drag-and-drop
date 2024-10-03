import { FileInfo } from "~/types/types";
import { Card, CardContent } from "./ui/card";
import { formatFileSize } from "~/utils/formatFileSize";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Separator } from "./ui/separator";

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
        <h1 className="text-2xl font-bold">Stats</h1>
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-xl font-bold">Total Files</h2>
            <p className="font-light">{files.length} Files</p>
          </div>
          <Separator className="my-3" />
          <div>
            <h2 className="text-xl font-bold">Total Size</h2>
            <p className="font-light">
              {formatFileSize(files.reduce((acc, file) => acc + file.size, 0))}
            </p>
          </div>
          <Separator className="my-3" />
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
          <Separator className="my-3" />
          <div>
            <h2 className="text-xl font-bold">File Breakdown</h2>
            <Accordion type="single" collapsible className="pl-5 space-y-2">
              {(() => {
                const typeCount = files.reduce((acc, file) => {
                  const extension =
                    file.name.split(".").pop()?.toLowerCase() || "unknown";
                  acc[extension] = (acc[extension] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                const typeEntries = Object.entries(typeCount);

                if (typeEntries.length === 0) {
                  return <li>None</li>;
                }

                return typeEntries.map(([type, count]) => (
                  <AccordionItem key={type} value={type} className="">
                    <AccordionTrigger className="flex items-center">
                      <div>
                        <span className="font-semibold text-lg">.{type}</span>
                        <span className="ml-1">({count})</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Total Size:{" "}
                        {formatFileSize(
                          files
                            .filter((file) => file.name.endsWith(`.${type}`))
                            .reduce((acc, file) => acc + file.size, 0)
                        )}
                      </p>
                      <Separator className="my-3" />
                      <ul className="space-y-1">
                        {files
                          .filter((file) => file.name.endsWith(`.${type}`))
                          .map((file) => (
                            <li key={file.name}>
                              {file.name.length > 25
                                ? file.name.substring(0, 25) + "..."
                                : file.name}
                            </li>
                          ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ));
              })()}
            </Accordion>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BucketStats;
