"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { items } from "./constants";
import styles from "./travel.module.css";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

/* =========================
   Desktop card (保留你的动效)
========================= */
const ImageCardDesktop = ({ item, index, total, scrollProgress }) => {
  const distanceFromCenter = useTransform(scrollProgress, (p) => {
    const virtualPos = p * (total + 1);
    return virtualPos - index;
  });

  const springPos = useSpring(distanceFromCenter, {
    stiffness: 120,
    damping: 25,
  });

  const zIndex = useTransform(springPos, (val) =>
    Math.round(2000 - Math.abs(val) * 200)
  );

  const cardSize =
    item.orientation === "landscape"
      ? { width: "820px", height: "560px" } // ⬅️ 原来 650*450
      : { width: "560px", height: "820px" };

  const x = useTransform(
    springPos,
    [-2, -1, -0.4, 0.4, 1, 2],
    [1400, 700, 40, -40, -700, -1400]
  );

  const y = useTransform(springPos, [-2, -0.4, 0.4, 2], [400, 0, 0, -400]);

  const zVal = useTransform(
    springPos,
    [-2, -0.4, 0.4, 1.2, 2],
    [-3000, 0, 0, -1200, -2500]
  );
  const translateZ = useTransform(zVal, (v) => `${v}px`);

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
  const scale = useTransform(
    springPos,
    [-1.2, -0.4, 0.4, 1.2],
    [0.5, 1.15, 1.15, 0.4]
  );
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
        translateZ,
        rotateY,
        skewX,
        scale,
        opacity,
      }}
      className={`${styles.gpuLayer} ${styles.group} ${styles.imageCard}`}
    >
      <div className={styles.imageCardWrapper}>
        <img
          src={item.url}
          alt={item.title}
          loading="lazy"
          className={styles.cardImg}
        />

        <div className={styles.decorLineTop} />
        <div className={styles.decorLineBottom} />
        <div className={styles.glowLine} />

        <motion.div
          style={{
            opacity: useTransform(
              springPos,
              [-0.4, -0.2, 0.2, 0.4],
              [0, 1, 1, 0]
            ),
            y: useTransform(springPos, [-0.4, 0, 0.4], [20, 0, -20]),
          }}
          className={styles.cardOverlay}
        >
          <div className={styles.cardSpec}>
            <motion.span
              className={styles.cardSpecLabel}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {item.location.toUpperCase()}
            </motion.span>
            <h3 className={styles.cardTitle}>{item.title}</h3>
          </div>
          <p className={styles.cardDescription}>{item.description}</p>
        </motion.div>
      </div>

      <motion.div
        style={{
          opacity: useTransform(springPos, [-0.6, 0, 0.6], [0, 0.3, 0]),
          scale: useTransform(springPos, [-0.6, 0, 0.6], [0.8, 1.3, 0.8]),
        }}
        className={styles.ambientGlow}
      />
    </motion.div>
  );
};

/* =========================
   Mobile card (极简：纯 div + CSS transition)
   - 不用 motion
   - 不用 useTransform/useSpring
   - 只渲染 1 张卡
========================= */
const ImageCardMobileSimple = ({ item, visibleKey }) => {
  const isLandscape = item.orientation === "landscape";

  return (
    <div
      key={visibleKey}
      className={`${styles.mobileCard} ${
        isLandscape ? styles.mobileLandscape : styles.mobilePortrait
      }`}
    >
      <div className={styles.mobileCardWrap}>
        <img
          src={item.url}
          alt={item.title}
          loading="lazy"
          className={styles.mobileImg}
        />

        <div className={styles.mobileOverlay}>
          <div className={styles.mobileSpecRow}>
            <span className={styles.mobileSpec}>
              {item.location.toUpperCase()}
            </span>
            <span className={styles.mobileIndexHint}>{item.id}</span>
          </div>
          <h3 className={styles.mobileTitle}>{item.title}</h3>
          <p className={styles.mobileDesc}>{item.description}</p>
        </div>
      </div>
    </div>
  );
};

export default function Travel() {
  const containerRef = useRef(null);
  const isMobile = useIsMobile(768);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: isMobile ? 40 : 30,
    damping: isMobile ? 25 : 15,
    restDelta: 0.0001,
  });

  // ✅ 关键：hooks 必须无条件调用（即使手机端不用 HUD，也要在这里调用）
  const hudOpacity = useTransform(smoothProgress, [0, 1], [0.2, 1]);

  const perItemVH = isMobile ? 90 : 200;

  const [activeIndex, setActiveIndex] = useState(0);
  const [swapKey, setSwapKey] = useState(0);

  useEffect(() => {
    const source = isMobile ? scrollYProgress : smoothProgress;
    const unsub = source.on("change", (p) => {
      const i = Math.round(p * (items.length - 1));
      setActiveIndex((prev) => {
        const next = Math.max(0, Math.min(items.length - 1, i));
        if (next !== prev) setSwapKey((k) => k + 1);
        return next;
      });
    });
    return () => unsub();
  }, [isMobile, scrollYProgress, smoothProgress]);

  const currentItem = items[activeIndex];

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{ height: `${items.length * perItemVH}vh` }}
    >
      {/* ✅ 这里可以条件渲染组件，但不要在里面调用 hook */}
      {!isMobile && (
        <div className={styles.hudOverlay}>
          <div className={styles.progressContainer}>
            <span className={styles.progressLabel}>Scroll_Progress</span>
            <div className={styles.progressBarWrapper}>
              <motion.div
                style={{ scaleY: smoothProgress, originY: 0 }}
                className={styles.progressBar}
              />
            </div>

            {/* ✅ 用提前算好的 hudOpacity */}
            <motion.div
              style={{ opacity: hudOpacity }}
              className={styles.progressNumber}
            >
              {items.length}
            </motion.div>
          </div>
        </div>
      )}

      <div
        className={[
          styles.stickyContainer,
          styles.worldContainer,
          isMobile ? styles.worldContainerMobile : "",
        ].join(" ")}
      >
        <div className={styles.bgGradient} />
        <div className={styles.bgHeadline} aria-hidden="true">
          <span className={styles.bgHeadlineText}>
            Beautiful places I have been
          </span>
        </div>

        {!isMobile && (
          <div className={styles.bgLines}>
            <div className={styles.bgLine1} />
            <div className={styles.bgLine2} />
          </div>
        )}

        <div
          className={[
            styles.stageContainer,
            isMobile ? styles.stageContainerMobile : styles.gpuLayer,
          ].join(" ")}
        >
          {isMobile ? (
            <ImageCardMobileSimple item={currentItem} visibleKey={swapKey} />
          ) : (
            items.map((it, idx) => (
              <ImageCardDesktop
                key={it.id}
                item={it}
                index={idx}
                total={items.length}
                scrollProgress={smoothProgress}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
