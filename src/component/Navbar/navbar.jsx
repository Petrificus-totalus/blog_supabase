"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css";
import { FaLeaf, FaUtensils, FaPiggyBank, FaBookOpen } from "react-icons/fa";

export default function VerticalNavbar() {
  const [showLearnMenu, setShowLearnMenu] = useState(false);

  const handleToggleLearn = () => {
    setShowLearnMenu((prev) => !prev);
  };

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.sidebar}>
        <div className={styles.iconWrapper}>
          <Link href="/" className={styles.iconItem}>
            <img src="/logo.jpg" alt="pig" />
          </Link>
          <div className={styles.tooltip}>{`Home :)`}</div>
        </div>
        <div className={styles.iconWrapper}>
          <Link href="/flower" className={styles.iconItem}>
            <img src="/flower.png" alt="flower" />
          </Link>
          <div className={styles.tooltip}>Beautiful flowers I delivered</div>
        </div>

        <div className={styles.iconWrapper}>
          <Link href="/projects" className={styles.iconItem}>
            <img src="/projects.png" alt="projects" />
          </Link>
          <div className={styles.tooltip}>Websites I developed</div>
        </div>

        <div className={styles.iconWrapper}>
          <Link href="/cook" className={styles.iconItem}>
            <img src="/cook.png" alt="cook" />
          </Link>
          <div className={styles.tooltip}>I’m so hungry... I wanna eat!</div>
        </div>

        <div className={styles.iconWrapper}>
          <Link href="/spend" className={styles.iconItem}>
            <img src="/wallet.png" alt="wallet" />
          </Link>
          <div className={styles.tooltip}>Where all my money goes</div>
        </div>

        <div className={styles.iconWrapper}>
          <span onClick={handleToggleLearn} className={styles.iconItem}>
            <img src="/book.png" alt="book" />
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
