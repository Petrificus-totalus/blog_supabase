"use client";

import { useEffect, useRef, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import styles from "./scroll.module.css";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [pct, setPct] = useState(0); // 0~100
  const rafRef = useRef(0);

  useEffect(() => {
    const calc = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY || doc.scrollTop || 0;
      const ratio = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

      setPct(Math.round(ratio * 100));
      setVisible(y > 16);
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        calc();
      });
    };

    calc();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      className={styles.scrollTop}
      style={{ ["--pct"]: `${pct}%` }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={`Scroll to top (progress ${pct}%)`}
      title={`Scroll progress: ${pct}%`}
      type="button"
    >
      <span className={styles.inner}>
        <FaArrowUp className={styles.icon} />
        <span className={styles.pct}>{pct}%</span>
      </span>
    </button>
  );
}
