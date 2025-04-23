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
        <Link href="/flower" className={styles.iconItem} title="Flower">
          🌸
        </Link>
        <Link href="/cook" className={styles.iconItem} title="Cook">
          🍳
        </Link>
        <Link href="/spend" className={styles.iconItem} title="Spend">
          💰
        </Link>
        <span
          onClick={handleToggleLearn}
          className={styles.iconItem}
          title="Learn"
        >
          📚
        </span>
      </div>

      {showLearnMenu && (
        <div className={styles.learnMenu}>
          <Link
            href="/learn/java"
            className={styles.learnItem}
            onClick={() => setShowLearnMenu(false)}
          >
            <h4>Java</h4>
            <p>记录 Java 学习笔记</p>
          </Link>
          <Link
            href="/learn/algorithm"
            className={styles.learnItem}
            onClick={() => setShowLearnMenu(false)}
          >
            <h4>Algorithm</h4>
            <p>刷题总结、思路分析</p>
          </Link>
          <Link
            href="/learn/css"
            className={styles.learnItem}
            onClick={() => setShowLearnMenu(false)}
          >
            <h4>CSS</h4>
            <p>关于样式的技巧整理</p>
          </Link>
        </div>
      )}
    </div>
  );
}
