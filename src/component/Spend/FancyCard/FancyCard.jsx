// components/ui/FancyCard.jsx
"use client";
import React from "react";
import styles from "./FancyCard.module.css";

export default function FancyCard({ title, total, children }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <span className={styles.total}>¥{total}</span>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
