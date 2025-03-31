import { useState, useEffect } from "react";

export function usePlatform() {
  const [platform, setPlatform] = useState<"mac" | "other">("other");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPlatform(
        window.navigator.platform.toLowerCase().includes("mac")
          ? "mac"
          : "other"
      );
    }
  }, []);

  return platform;
}
