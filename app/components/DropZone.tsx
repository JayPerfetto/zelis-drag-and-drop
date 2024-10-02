import { Form, useActionData, useSubmit } from "@remix-run/react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone-esm";
import { action } from "~/routes/_index";

export const DropZone = () => {
  const actionData = useActionData<typeof action>();

  const submit = useSubmit();

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append("file", file);
      });
      submit(formData, { method: "post", encType: "multipart/form-data" });
    },
    [submit]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="w-full space-y-2">
      <h2 className="text-2xl font-bold">Upload a file</h2>
      <Form
        method="post"
        encType="multipart/form-data"
        className="flex flex-col w-full">
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-500 p-10 rounded-md">
          <input {...getInputProps()} />
          {actionData?.error ? (
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
