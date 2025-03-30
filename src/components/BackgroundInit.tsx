"use client";

import { useEffect } from "react";
import { lazyInitializeSQL } from "@/lib/sql";

export function BackgroundInit() {
  useEffect(() => {
    lazyInitializeSQL();
  }, []);

  return null;
} 