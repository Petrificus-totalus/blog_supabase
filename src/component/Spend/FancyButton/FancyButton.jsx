"use client";
import React from "react";
import styles from "./FancyButton.module.css";

export default function FancyButton({ children, onClick, small }) {
  return (
    <button
      className={`${styles.button} ${small ? styles.small : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
