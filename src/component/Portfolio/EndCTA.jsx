import React from "react";
import { motion, useTransform } from "framer-motion";

const EndCTA = ({ scrollYProgress }) => {
  // 设置在所有卡片完成位移后出现 (约 0.82 以后)
  const start = 0.85;
  const end = 1.0;

  const opacity = useTransform(scrollYProgress, [start, start + 0.05], [0, 1]);
  const scale = useTransform(scrollYProgress, [start, start + 0.05], [0.8, 1]);
  const blur = useTransform(
    scrollYProgress,
    [start, start + 0.05],
    ["20px", "0px"]
  );

  // 这一页快结束时，让固定箭头淡出（你可以微调两个数）
  const arrowFadeStart = 0.9; // 开始淡出
  const arrowFadeEnd = 0.98; // 完全消失

  const arrowOpacity = useTransform(
    scrollYProgress,
    [arrowFadeStart, arrowFadeEnd],
    [1, 0]
  );
  const arrowY = useTransform(
    scrollYProgress,
    [arrowFadeStart, arrowFadeEnd],
    [0, -20]
  );
  const arrowBlur = useTransform(
    scrollYProgress,
    [arrowFadeStart, arrowFadeEnd],
    ["blur(0px)", "blur(14px)"]
  );

  return (
    <motion.div
      style={{ opacity, scale, filter: blur }}
      className="end-cta-container"
    >
      <div className="end-cta">
        <div className="end-cta-content">
          <h2 className="end-cta-title">
            THE
            <br />
            <span className="end-cta-title-accent">JOURNEY</span>
            <br />
            CONTINUES
          </h2>
          <p className="end-cta-description">
            Ready to explore the full depth of our technological ecosystem? The
            vault awaits.
          </p>

          <div className="end-cta-button-container">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="end-cta-button"
            >
              ENTER THE ARCHIVE
            </motion.button>
          </div>
        </div>
      </div>

      {/* 指向侧边栏的箭头（整体控制） */}
      <motion.div
        animate={{ x: [-15, 15, -15] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="end-cta-arrow"
        style={{
          opacity: arrowOpacity,
          y: arrowY,
          filter: arrowBlur,
          // 可选：淡出后不再挡住点击
          pointerEvents: useTransform(
            scrollYProgress,
            [arrowFadeStart, arrowFadeEnd],
            ["auto", "none"]
          ),
        }}
      >
        <div className="end-cta-arrow-glow">
          <div className="end-cta-arrow-glow-bg" />
          <svg
            className="end-cta-arrow-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>

        <div className="end-cta-arrow-text">
          <span className="end-cta-arrow-title">PROJECTS</span>
          <span className="end-cta-arrow-subtitle">Navigate the archive</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EndCTA;
