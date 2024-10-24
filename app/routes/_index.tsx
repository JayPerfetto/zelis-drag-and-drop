import { useState, useEffect, useMemo } from "react";
import { json, useLoaderData } from "@remix-run/react";
import { useDarkMode } from "~/hooks/useDarkMode";
import { useFileStatusTimer } from "~/hooks/useFileStatusTimer";
import { FileList } from "~/components/FileList";
import { DropZone } from "~/components/DropZone";
import { Card, CardContent } from "~/components/ui/card";
import ThreeJS from "~/components/ThreeJS";
import { Button } from "~/components/ui/button";
import { FileStatus } from "~/components/FileStatus";
import { listFiles } from "~/services/s3Service"; // Import your S3 service

export const loader = async () => {
  try {
    const files = await listFiles();
    return json({ files });
  } catch (err) {
    return json({ files: [], error: err.message }, { status: 500 });
  }
};

export default function Index() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { fileStatus, startFileStatusTimer } = useFileStatusTimer();
  const loaderData = useLoaderData<typeof loader>();
  const [files, setFiles] = useState(loaderData.files);

  useEffect(() => {
    if (loaderData.files) setFiles(loaderData.files);
  }, [loaderData]);

  const filteredFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      return (
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      );
    });
  }, [files]);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <main className="overflow-hidden">
      <div
        className="h-full w-full absolute right-0 hidden 2xl:block bg-transparent"
        aria-hidden={true}
      >
        {darkMode && (
          <Button
            className={`absolute bottom-8 right-8 z-50 ${
              fileStatus ? "" : "opacity-50 text-muted-foreground"
            }`}
            onClick={() => startFileStatusTimer()}
          >
            Effects
          </Button>
        )}
        <ThreeJS darkMode={darkMode} />
      </div>
      <div className="p-2 bg-white dark:bg-[#101010] md:flex-row md:p-10 flex gap-2 md:gap-6 min-h-screen">
        <Card className="md:p-6 pt-6 md:pt-10 w-full max-w-3xl">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <DropZone
              startFileStatusTimer={startFileStatusTimer}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
            <FileStatus status={fileStatus} />
            <FileList files={filteredFiles} errorMessage={loaderData.error} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
