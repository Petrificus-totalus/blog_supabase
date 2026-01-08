import React, { useRef, useMemo } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Page from "./Page";
import "./book.css";

const BOOK_PAGES = [
  {
    title: "Origins of Light",
    text: "Before the stars were forged in the celestial kiln, there was only the Great Void. It was a silence so profound it echoed throughout eternity, waiting for the first word to be whispered into existence. That word was 'Seek', and from it, all knowledge blossomed like a nocturnal flower.",
    pageNum: 1,
  },
  {
    title: "The Silent Watchers",
    text: "In the high peaks of the Aetheria Mountains, the keepers of the scroll maintained their vigil. They spoke not with tongues, but with the intent of the soul, weaving patterns of light into the very fabric of reality to preserve the truths of the ancient kings.",
    pageNum: 2,
  },
  {
    title: "The Final Horizon",
    text: "As we turn the penultimate page of this journey, we realize that the end is merely a gateway. The ink of our lives may dry, but the story we have authored together remains etched in the permanent record of the universe, a testament to the curiosity that defines us.",
    pageNum: 3,
  },
];

const ParticleField = () => {
  const particles = useMemo(() => Array.from({ length: 40 }), []);
  return (
    <div className="particle-field">
      {particles.map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            opacity: Math.random() * 0.5,
            animation: `float ${Math.random() * 10 + 10}s linear infinite`,
            animationDelay: `${-Math.random() * 20}s`,
          }}
        />
      ))}
    </div>
  );
};

const BookSection = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Camera Movement (The "Cool" Factor)
  const bookScale = useTransform(
    smoothProgress,
    [0, 0.15, 0.85, 1],
    [0.85, 1, 1, 0.9]
  );
  const bookRotateX = useTransform(smoothProgress, [0, 0.5, 1], [15, 0, -10]);
  const bookRotateZ = useTransform(smoothProgress, [0, 0.5, 1], [-2, 0, 2]);
  const bookY = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [50, 0, 0, -50]);

  return (
    <div ref={containerRef} className="book-section-container">
      <div className="book-sticky-wrapper">
        {/* Dynamic Atmosphere */}
        <div className="book-atmosphere" />
        <div className="book-glow" />
        <ParticleField />

        {/* Floating cinematic book */}
        <motion.div
          style={{
            scale: bookScale,
            rotateX: bookRotateX,
            rotateZ: bookRotateZ,
            y: bookY,
          }}
          className="book-container"
        >
          <motion.div className="book-inner">
            {/* Left Static Base (Back Cover) */}
            <div className="book-left-cover">
              <div className="book-left-cover-gradient" />
              {/* Spine shadow */}
              <div className="book-spine-shadow" />

              {/* Internal Left Page Content (Static) */}
              <div className="book-left-page">
                <div className="book-left-page-content">
                  <div className="book-toc-title">Table of Contents</div>
                  <div className="book-toc-items">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="book-toc-item">
                        <div className="book-toc-line book-toc-line-long" />
                        <div className="book-toc-line book-toc-line-short" />
                      </div>
                    ))}
                  </div>
                  <div className="book-library-text">
                    Library of Ethereal Wisdom
                  </div>
                </div>
              </div>
            </div>

            {/* Flipped Pages */}
            <Page
              index={0}
              progress={smoothProgress}
              range={[0.1, 0.3]}
              content={{ title: "Chronicle of Aether", text: "", pageNum: 0 }}
              isCover
            />

            <Page
              index={1}
              progress={smoothProgress}
              range={[0.35, 0.55]}
              content={BOOK_PAGES[0]}
            />

            <Page
              index={2}
              progress={smoothProgress}
              range={[0.6, 0.8]}
              content={BOOK_PAGES[1]}
            />

            {/* Fixed Right Base (The Last Page) */}
            <div className="book-right-page">
              <div className="page-texture" />
              <div className="book-right-page-content">
                <h3 className="page-title">{BOOK_PAGES[2].title}</h3>
                <div className="page-title-divider" />
                <p className="page-text">{BOOK_PAGES[2].text}</p>
              </div>
              <div className="page-footer">
                <span>&mdash; The End &mdash;</span>
                <span>48</span>
              </div>
              {/* Stacked pages effect */}
              <div className="book-right-page-stack">
                <div className="book-right-page-stack-item" />
                <div className="book-right-page-stack-item-2" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Cinematic Lighting Overlay */}
        <div className="book-lighting" />

        {/* Indicators */}
        <motion.div
          style={{ opacity: useTransform(smoothProgress, [0, 0.05], [1, 0]) }}
          className="book-indicator"
        >
          <div className="book-indicator-text">Begin the Journey</div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="book-indicator-line book-indicator-line-animated"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default BookSection;
