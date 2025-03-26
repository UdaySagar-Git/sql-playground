import { ThemeToggle } from "../components/theme/ThemeToggle";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <ThemeToggle />
      <main className={styles.main}>
        <h1>Welcome to Next.js</h1>
      </main>
    </div>
  );
}
