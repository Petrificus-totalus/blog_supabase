"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css";

export default function VerticalNavbar() {
  const [showLearnMenu, setShowLearnMenu] = useState(false);

  const handleToggleLearn = () => {
    setShowLearnMenu((prev) => !prev);
  };

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.sidebar}>
        <div className={styles.iconWrapper}>
          <Link href="/flower" className={styles.iconItem} title="Flower">
            🌸
          </Link>
          <div className={styles.tooltip}>Beautiful flowers I delivered</div>
        </div>

        <div className={styles.iconWrapper}>
          <Link href="/cook" className={styles.iconItem} title="Cook">
            🍳
          </Link>
          <div className={styles.tooltip}>I’m so hungry... I wanna eat!</div>
        </div>

        <div className={styles.iconWrapper}>
          <Link href="/spend" className={styles.iconItem} title="Spend">
            💰
          </Link>
          <div className={styles.tooltip}>Where all my money goes</div>
        </div>

        <div className={styles.iconWrapper}>
          <span
            onClick={handleToggleLearn}
            className={styles.iconItem}
            title="Learn"
          >
            📚
          </span>
          <div className={styles.tooltip}>Live and learn</div>
        </div>
      </div>

      {showLearnMenu && (
        <div className={styles.learnMenu}>
          <Link
            href="/learn/java"
            className={styles.learnItem}
            onClick={() => setShowLearnMenu(false)}
          >
            <h4>Java</h4>
            <p>Java study notes</p>
          </Link>
          <Link
            href="/learn/algorithm"
            className={styles.learnItem}
            onClick={() => setShowLearnMenu(false)}
          >
            <h4>Algorithm</h4>
            <p>Problem solving & analysis</p>
          </Link>
          <Link
            href="/learn/css"
            className={styles.learnItem}
            onClick={() => setShowLearnMenu(false)}
          >
            <h4>CSS</h4>
            <p>Styling tricks & tips</p>
          </Link>
        </div>
      )}
    </div>
  );
}
