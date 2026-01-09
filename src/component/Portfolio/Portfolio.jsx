import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import PortfolioCard from "./PortfolioCard";
import EndCTA from "./EndCTA";
import { PORTFOLIO_DATA } from "./constants";
import "./portfolio.css";

const Portfolio = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 基础开场动画逻辑
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const headerScale = useTransform(scrollYProgress, [0, 0.12], [1, 1.8]);
  const headerBlur = useTransform(scrollYProgress, [0, 0.1], ["0px", "20px"]);

  return (
    <div className="app-container">
      {/* 滚动轨道：保持垂直滚动以驱动动画，但视觉上呈现横向流转 */}
      <div ref={containerRef} className="scroll-track">
        <div className="sticky-container">
          {/* 星空背景 */}
          <div className="stars-container">
            {Array.from({ length: 100 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.1, 0.4, 0.1],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                }}
                className="star"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  scale: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* 首页标题 */}
          <motion.div
            style={{
              opacity: headerOpacity,
              scale: headerScale,
              filter: headerBlur,
            }}
            className="header-section"
          >
            <h1 className="header-title-large">CREATIVE</h1>
            <div className="header-content">
              <h2 className="header-title">
                My <span className="header-title-accent">Projects</span>
              </h2>
              <p className="header-subtitle">Portfolio Showcase 2024</p>
              <div className="scroll-indicator-container">
                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="scroll-indicator"
                >
                  <motion.div className="scroll-dot" />
                </motion.div>
                <span className="scroll-text">Scroll to Traverse</span>
              </div>
            </div>
          </motion.div>

          {/* 横向流转卡片 */}
          {PORTFOLIO_DATA.map((item, index) => (
            <PortfolioCard
              key={item.id}
              index={index}
              item={item}
              scrollYProgress={scrollYProgress}
            />
          ))}

          {/* 结尾 CTA */}
          <EndCTA scrollYProgress={scrollYProgress} />
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
