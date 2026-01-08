import React from "react";
import { motion, useTransform, useSpring } from "framer-motion";

const Page = ({ index, progress, range, content, isCover = false }) => {
  // Use a spring for the flip to make it feel more organic
  const rawRotation = useTransform(progress, range, [0, -180]);
  const rotateY = useSpring(rawRotation, { stiffness: 60, damping: 20 });

  // Z-index shifts during flip
  const zIndex = useTransform(progress, range, [100 - index, 100 + index]);

  // Optical effect: Darken the page as it turns away from light
  const brightness = useTransform(progress, range, [1, 0.5]);
  const backBrightness = useTransform(progress, range, [0.5, 1]);

  // Specular highlight during turn
  const highlightOpacity = useTransform(
    progress,
    [range[0], (range[0] + range[1]) / 2, range[1]],
    [0, 0.4, 0]
  );

  return (
    <motion.div
      style={{
        rotateY,
        zIndex,
        transformOrigin: "left center",
      }}
      className="page-wrapper"
    >
      {/* Front Face */}
      <motion.div
        style={{ filter: `brightness(${brightness})` }}
        className={`page-front ${
          isCover ? "page-front-cover" : "page-front-normal"
        }`}
      >
        {/* Paper Texture Overlay */}
        <div className="page-texture" />

        {isCover ? (
          <div className="page-cover-content">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              style={{ marginBottom: "2rem" }}
            >
              <div className="page-cover-icon">
                <span className="page-cover-icon-text">A</span>
              </div>
            </motion.div>
            <h2 className="page-cover-title">{content.title}</h2>
            <div className="page-cover-divider"></div>
            <p className="page-cover-subtitle">Mmxiv Edition</p>
          </div>
        ) : (
          <div className="page-content">
            <motion.div
              className="page-normal-content"
              style={{
                opacity: useTransform(
                  progress,
                  [range[0], range[0] + 0.05],
                  [0, 1]
                ),
              }}
            >
              <h3 className="page-title">{content.title}</h3>
              <div className="page-title-divider" />
              <p className="page-text">{content.text}</p>
            </motion.div>
            <div className="page-footer">
              <span>&mdash; Chapter {content.pageNum} &mdash;</span>
              <span>{content.pageNum * 2}</span>
            </div>
          </div>
        )}

        {/* Dynamic Highlight overlay */}
        <motion.div
          style={{ opacity: highlightOpacity }}
          className="page-highlight"
        />
      </motion.div>

      {/* Back Face (Reverse side of paper) */}
      <motion.div
        className="page-back"
        style={{
          transform: "rotateY(180deg)",
          filter: `brightness(${backBrightness})`,
        }}
      >
        <div className="page-texture" />
        <div className="page-back-content">
          {/* Subtle ghosting effect of text */}
          <div className="page-back-ghost">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="page-back-ghost-line"
                style={{ width: `${60 + Math.random() * 40}%` }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Page;
