import { FileInfo } from "~/types/types";
import { Card, CardContent } from "~/components/ui/card";

const SortContainer = ({
  files,
  className,
}: {
  files: FileInfo[];
  className?: string;
}) => {
  return (
    <Card className={`w-full md:p-6 pt-6 md:pt-10 ${className}`}>
      <CardContent className="flex flex-col justify-center space-y-4">
        <h1 className="text-2xl font-bold">Sort Container</h1>
      </CardContent>
    </Card>
  );
};

export default SortContainer;
