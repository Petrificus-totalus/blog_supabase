"use client";
import Link from "next/link";
import styles from "./Sidebar.module.css";

export default function VerticalNavbar() {
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
          <div className={styles.tooltip}>I'm so hungry... I wanna eat!</div>
        </div>

        <div className={styles.iconWrapper}>
          <Link href="/spend" className={styles.iconItem}>
            <img src="/wallet.png" alt="wallet" />
          </Link>
          <div className={styles.tooltip}>Where all my money goes</div>
        </div>

        <div className={styles.iconWrapper}>
          <Link href="/learn" className={styles.iconItem}>
            <img src="/book.png" alt="book" />
          </Link>
          <div className={styles.tooltip}>Live and learn</div>
        </div>
      </div>
    </div>
  );
}
