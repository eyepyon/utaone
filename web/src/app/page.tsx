import Image from "next/image";
import styles from "./page.module.css";
import { AudioRecorder } from "./components/audio-recorder";
import { ThreeScene } from "./components/three-scene";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ThreeScene />
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}
