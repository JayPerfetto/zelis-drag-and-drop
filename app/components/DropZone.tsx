import { Icon } from "@iconify/react";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone-esm";
import { action } from "~/routes/_index";

export const DropZone = ({
  darkMode,
  toggleDarkMode,
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
}) => {
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();

  // Handle the file drop
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append("file", file);
      });
      submit(formData, { method: "post", encType: "multipart/form-data" });
    },
    [submit]
  );

  // Get the root props for the drop zone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Upload a file</h2>
        <div className="flex gap-2">
          {/* GitHub Link and Dark Mode Toggle */}
          <a
            href="https://github.com/aidankmcalister/zelis-drag-and-drop"
            target="_blank">
            <Icon
              className="w-8 h-8 hover:scale-110 transition-all"
              icon="fa6-brands:github"
            />
          </a>
          <button onClick={toggleDarkMode}>
            <Icon
              className="w-8 h-8 hover:scale-110 transition-all"
              icon={darkMode ? "lucide:sun" : "lucide:moon"}
            />
          </button>
        </div>
      </div>
      <Form
        method="post"
        encType="multipart/form-data"
        className="flex flex-col w-full">
        {/* Drop Zone */}
        <div
          {...getRootProps()}
          aria-label="File Drop Zone"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              (e.currentTarget as HTMLElement).click();
            }
          }}
          className={`border-2 border-dashed border-gray-500 h-40 flex items-center cursor-pointer justify-center hover:bg-gray-100 dark:hover:bg-neutral-800 hover:scale-[1.01] p-10 rounded-md transition-transform ${
            isDragActive ? "bg-gray-100 scale-[1.01]" : ""
          }`}>
          <input {...getInputProps()} aria-hidden="true" />
          {isDragActive ? (
            <p className="text-center">Drop the file here...</p>
          ) : actionData?.error ? (
            <p className="text-center text-red-500">{actionData.error}</p>
          ) : actionData?.success ? (
            <p className="text-center text-green-500">
              File uploaded successfully!
            </p>
          ) : (
            <p className="text-center">
              Drag a file here or click to select a file.
            </p>
          )}
        </div>
      </Form>
    </div>
  );
};
