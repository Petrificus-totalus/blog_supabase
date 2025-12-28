"use client";
import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import styles from "./scroll.module.css";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [pct, setPct] = useState(0); // 0 ~ 100

  useEffect(() => {
    const calc = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const ratio = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      setPct(Math.round(ratio * 100));
      setVisible(y > 8);
    };

    calc();
    window.addEventListener("scroll", calc, { passive: true });
    window.addEventListener("resize", calc);
    return () => {
      window.removeEventListener("scroll", calc);
      window.removeEventListener("resize", calc);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      className={styles.scrollTop}
      style={{ ["--pct"]: `${pct}%` }} // 传给 CSS 的百分比
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={`Scroll to top (progress ${pct}%)`}
      title={`Scroll progress: ${pct}%`}
    >
      <FaArrowUp />
    </button>
  );
}
