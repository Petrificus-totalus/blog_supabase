// components/ui/FancyTag.jsx
"use client";
import React from "react";
import styles from "./FancyTag.module.css";

export default function FancyTag({ children }) {
  return <span className={styles.tag}>{children}</span>;
}
