// components/ui/ImageCarousel.jsx
"use client";
import React, { useState } from "react";
import styles from "./ImageCarousel.module.css";

export default function ImageCarousel({ images = [] }) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((current - 1 + images.length) % images.length);
  const next = () => setCurrent((current + 1) % images.length);

  return (
    <div className={styles.carousel}>
      {images.length > 0 && (
        <img
          src={images[current]}
          className={styles.image}
          alt={`slide-${current}`}
        />
      )}
      <div className={styles.controls}>
        <button onClick={prev}>&larr;</button>
        <span>
          {current + 1} / {images.length}
        </span>
        <button onClick={next}>&rarr;</button>
      </div>
    </div>
  );
}
