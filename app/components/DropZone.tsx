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
    <Form method="post" encType="multipart/form-data">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-500 p-10 rounded-md">
        <input {...getInputProps()} />
        <p className="text-center">
          Drag n drop some files here, or click to select files
        </p>
      </div>
      <p
        className={`${
          actionData?.error
            ? "text-red-500"
            : actionData?.success
            ? "text-green-500"
            : ""
        }`}>
        {actionData?.error ||
          (actionData?.success && "File uploaded successfully!") ||
          ""}
      </p>
    </Form>
  );
};
