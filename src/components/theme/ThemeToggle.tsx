"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import styles from "./ThemeToggle.module.css";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className={styles.themeToggle}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className={styles.sun} />
      <Moon className={styles.moon} />
    </button>
  );
}; 