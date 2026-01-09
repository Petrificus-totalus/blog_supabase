import React from "react";
import { motion, useTransform } from "framer-motion";

const PortfolioCard = ({ item, index, scrollYProgress }) => {
  // 定义重叠的横向滚动范围
  // 每个卡片占用约 30% 的滚动里程，但彼此重叠 15%
  const step = 0.15;
  const start = 0.12 + index * step;
  const end = start + step * 2.2;

  // 关键帧定义：进入 (start) -> 停留中心 (peakStart to peakEnd) -> 离开 (end)
  const peakStart = start + step * 0.5;
  const peakEnd = end - step * 0.5;

  // 变换映射
  const x = useTransform(
    scrollYProgress,
    [start, peakStart, peakEnd, end],
    ["120vw", "0vw", "0vw", "-120vw"]
  );
  const scale = useTransform(
    scrollYProgress,
    [start, peakStart, peakEnd, end],
    [0.4, 1, 1, 0.4]
  );
  const opacity = useTransform(
    scrollYProgress,
    [start, peakStart - 0.05, peakEnd + 0.05, end],
    [0, 1, 1, 0]
  );
  const rotateY = useTransform(
    scrollYProgress,
    [start, peakStart, peakEnd, end],
    [-45, 0, 0, 45]
  );
  const z = useTransform(
    scrollYProgress,
    [start, peakStart, peakEnd, end],
    [-800, 0, 0, -800]
  );
  const blur = useTransform(
    scrollYProgress,
    [start, peakStart, peakEnd, end],
    ["10px", "0px", "0px", "10px"]
  );

  // 根据颜色字符串获取对应的 CSS 类
  const getGradientClass = (colorString) => {
    if (colorString.includes("blue")) return "gradient-blue";
    if (colorString.includes("purple")) return "gradient-purple";
    if (colorString.includes("emerald")) return "gradient-emerald";
    if (colorString.includes("orange")) return "gradient-orange";
    return "gradient-blue";
  };

  return (
    <motion.div
      style={{
        x,
        scale,
        opacity,
        rotateY,
        z,
        filter: blur,
        perspective: "2000px",
        zIndex: index + 20,
      }}
      className="portfolio-card-container"
    >
      <div className="portfolio-card">
        {/* 背景光晕 */}
        <div
          className={`portfolio-card-glow ${getGradientClass(item.color)}`}
        />

        {/* 左侧文字区 */}
        <div className="portfolio-card-content">
          <div className="portfolio-card-header">
            <div className="portfolio-card-label">
              <span className="portfolio-card-line" />
              <span className="portfolio-card-label-text">
                COLLECTION {item.id}
              </span>
            </div>
            <h2 className="portfolio-card-title">{item.title}</h2>
          </div>

          <p className="portfolio-card-description">{item.description}</p>

          <div className="portfolio-card-tech">
            {item.techStack.map((tech) => (
              <span key={tech} className="portfolio-card-tech-item">
                {tech}
              </span>
            ))}
          </div>

          <motion.a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, x: 10 }}
            className="portfolio-card-button"
          >
            VIEW PROJECT
            <svg
              className="portfolio-card-button-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </motion.a>
        </div>

        {/* 右侧视觉展示 */}
        <div className="portfolio-card-visual">
          {/* Web端封面 */}
          <motion.div
            animate={{ y: [-15, 15, -15], rotateZ: [-1, 1, -1] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="portfolio-card-web"
          >
            <div className="portfolio-card-web-header">
              <div className="portfolio-card-web-dots">
                <div className="portfolio-card-web-dot red" />
                <div className="portfolio-card-web-dot yellow" />
                <div className="portfolio-card-web-dot green" />
              </div>
            </div>
            <img
              src={item.webImage}
              alt={item.title}
              className="portfolio-card-web-image"
            />
          </motion.div>

          {/* 手机端封面 */}
          <motion.div
            animate={{ y: [20, -20, 20], rotateZ: [1, -1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="portfolio-card-mobile"
          >
            <img
              src={item.mobileImage}
              alt={item.title}
              className="portfolio-card-mobile-image"
            />
            <div className="portfolio-card-mobile-notch" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioCard;
