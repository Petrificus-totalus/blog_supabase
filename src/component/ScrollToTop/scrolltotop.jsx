"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import styles from "./scroll.module.css";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  // 百分比文字
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const update = (v) => {
      const p = Math.round(v * 100);
      setPercentage(p);
      setIsVisible(v > 0.005);
    };

    // 初始化一次（避免首次不显示/不更新）
    update(scrollYProgress.get());

    const unsubscribe = scrollYProgress.on("change", update);
    return () => unsubscribe();
  }, [scrollYProgress]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          className={styles.wrap}
        >
          <motion.button
            type="button"
            onClick={scrollToTop}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className={styles.btn}
            aria-label="Scroll to top"
          >
            {/* 玻璃背景环 */}
            <div className={styles.glass} />

            {/* 进度环 */}
            <svg className={styles.ring} viewBox="0 0 64 64" aria-hidden="true">
              <circle cx="32" cy="32" r="30" className={styles.ringTrack} />
              <motion.circle
                cx="32"
                cy="32"
                r="30"
                className={styles.ringProgress}
                // pathLength=1 时，strokeDasharray 用 1 更方便
                pathLength={1}
                style={{ pathLength: scrollYProgress }}
              />
            </svg>

            {/* 内容 */}
            <div className={styles.inner}>
              <motion.svg
                className={styles.arrow}
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 15l7-7 7 7"
                />
              </motion.svg>

              <span className={styles.percent}>{percentage}%</span>
            </div>

            {/* hover 外扩光晕 */}
            <div className={styles.glow} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
