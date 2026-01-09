import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { items } from "./constants";
import "./travel.css";

const ImageCard = ({ item, index, total, scrollProgress }) => {
  const distanceFromCenter = useTransform(scrollProgress, (p) => {
    const virtualPos = p * (total + 1);
    return virtualPos - index;
  });

  // 弹簧配置：稍微降低阻尼，让进入和离开 plateau 的过程更顺滑
  const springPos = useSpring(distanceFromCenter, {
    stiffness: 120,
    damping: 25,
  });

  const zIndex = useTransform(springPos, (val) => {
    // 扩大 zIndex 覆盖范围，确保在中心停留期间始终置顶
    return Math.round(2000 - Math.abs(val) * 200);
  });

  // 根据横竖图定义尺寸
  const cardSize =
    item.orientation === "landscape"
      ? { width: "650px", height: "450px" }
      : { width: "450px", height: "650px" };

  // --- 轨迹与变换优化：增加 "展示停留区" (Focus Plateau) ---
  // 定义展示区间为 [-0.4, 0.4]

  // X轴：在中心区时，移动速度大幅减缓，产生一种"磁吸展示"的效果
  const x = useTransform(
    springPos,
    [-2, -1, -0.4, 0.4, 1, 2],
    [1400, 700, 40, -40, -700, -1400]
  );

  // Y轴：进场和出场带有弧度
  const y = useTransform(springPos, [-2, -0.4, 0.4, 2], [400, 0, 0, -400]);

  // Z轴：在展示区间内保持在最前方 (0)，出场时迅速推向远方
  const z = useTransform(
    springPos,
    [-2, -0.4, 0.4, 1.2, 2],
    [-3000, 0, 0, -1200, -2500]
  );

  // 倾斜与旋转：在展示区内基本保持正面，出场时产生大幅度折叠感
  const skewX = useTransform(
    springPos,
    [-1.2, -0.4, 0.4, 1.2],
    [20, 0, 0, -20]
  );
  const rotateY = useTransform(
    springPos,
    [-1.5, -0.4, 0.4, 1.5],
    [60, 0, 0, -60]
  );

  // 缩放：在展示区内保持最大尺寸 (1.1)
  const scale = useTransform(
    springPos,
    [-1.2, -0.4, 0.4, 1.2],
    [0.5, 1.15, 1.15, 0.4]
  );

  // 透明度：快速淡入，展示区全显，然后淡出
  const opacity = useTransform(
    springPos,
    [-1.5, -0.6, -0.4, 0.4, 0.6, 1.5],
    [0, 1, 1, 1, 1, 0]
  );

  return (
    <motion.div
      style={{
        position: "absolute",
        ...cardSize,
        left: "50%",
        top: "50%",
        x: useTransform(x, (v) => `calc(-50% + ${v}px)`),
        y: useTransform(y, (v) => `calc(-50% + ${v}px)`),
        zIndex,
        z,
        rotateY,
        skewX,
        scale,
        opacity,
      }}
      className="gpu-layer group image-card"
    >
      <div className="image-card-wrapper">
        <img src={item.url} alt={item.title} />

        {/* 精致的技术感 UI 线条 */}
        <div className="decor-line-top" />
        <div className="decor-line-bottom" />

        {/* 顶部流光特效 */}
        <div className="glow-line" />

        <motion.div
          style={{
            opacity: useTransform(
              springPos,
              [-0.4, -0.2, 0.2, 0.4],
              [0, 1, 1, 0]
            ),
            y: useTransform(springPos, [-0.4, 0, 0.4], [20, 0, -20]),
          }}
          className="card-overlay"
        >
          <div className="card-spec">
            <motion.span
              className="card-spec-label"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {item.orientation.toUpperCase()}
            </motion.span>
            <h3 className="card-title">{item.title}</h3>
          </div>
          <p className="card-description">{item.description}</p>
        </motion.div>
      </div>

      {/* 增强型环境光晕：在展示区最亮 */}
      <motion.div
        style={{
          opacity: useTransform(springPos, [-0.6, 0, 0.6], [0, 0.3, 0]),
          scale: useTransform(springPos, [-0.6, 0, 0.6], [0.8, 1.3, 0.8]),
        }}
        className="ambient-glow"
      />
    </motion.div>
  );
};

const App = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 30, // 稍微降低整体滚动的硬度，让衔接更丝滑
    damping: 15,
    restDelta: 0.0001,
  });

  return (
    <div
      ref={containerRef}
      className="container"
      style={{ height: `${items.length * 200}vh` }}
    >
      {/* HUD UI */}
      <div className="hud-overlay">
        {/* 导航进度 */}
        <div className="progress-container">
          <span className="progress-label">Scroll_Progress</span>
          <div className="progress-bar-wrapper">
            <motion.div
              style={{ scaleY: smoothProgress, originY: 0 }}
              className="progress-bar"
            />
          </div>
          <motion.div
            style={{ opacity: useTransform(smoothProgress, [0, 1], [0.2, 1]) }}
            className="progress-number"
          >
            {Math.round(items.length)}
          </motion.div>
        </div>
      </div>

      {/* 3D Stage */}
      <div className="sticky-container world-container">
        {/* 动态暗部渐变 */}
        <div className="bg-gradient" />

        {/* 背景微光线条 */}
        <div className="bg-lines">
          <div className="bg-line-1" />
          <div className="bg-line-2" />
        </div>

        <div className="stage-container gpu-layer">
          {items.map((item, index) => (
            <ImageCard
              key={item.id}
              item={item}
              index={index}
              total={items.length}
              scrollProgress={smoothProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
