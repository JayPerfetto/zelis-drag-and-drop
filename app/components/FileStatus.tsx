export const FileStatus = ({ status }: { status: number }) => {
  const steps = ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"];
  return (
    <ol className="flex items-center w-full">
      {steps.map((step, index) => (
        <li
          key={step}
          className={`flex items-center ${
            index !== steps.length - 1 ? "flex-1" : "flex-initial"
          }`}>
          <span
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              index < status
                ? "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black"
                : index === status
                ? "border-black dark:border-white text-black dark:text-white"
                : "border-gray-300 text-gray-300"
            }`}>
            {index + 1}
          </span>
          <span
            className={`ml-2 text-sm font-medium ${
              index <= status ? "text-black-600" : "text-gray-300"
            }`}>
            {step}
          </span>
          {index !== steps.length - 1 && (
            <div className={`grow h-0.5 mx-4 bg-gray-300 dark:bg-gray-700`}>
              <div
                className={`h-full bg-black dark:bg-white`}
                style={{
                  width: `${Math.max(0, Math.min(status - index, 1)) * 100}%`,
                  transition: status > index ? "width 2s ease-in-out" : "none",
                }}></div>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
};
