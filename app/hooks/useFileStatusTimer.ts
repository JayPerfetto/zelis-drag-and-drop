// useFileStatusTimer.ts
import { useState, useEffect } from "react";

export const useFileStatusTimer = () => {
  const [fileStatus, setFileStatus] = useState<number>(0);

  const startFileStatusTimer = () => {
    const steps = [1, 2, 3, 4, 5];
    let index = 0;
    const timer = setInterval(() => {
      setFileStatus(steps[index]);
      index++;
      if (index >= steps.length) {
        clearInterval(timer);
      }
    }, 2000);
    return () => clearInterval(timer);
  };

  return { fileStatus, startFileStatusTimer };
};
