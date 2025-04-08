"use client";
import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyIcon } from "@/assets/icons";
import styles from "./code.module.css";

export default function Code({ children, ...props }) {
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (props["language"]) {
      setLanguage(props["language"]);
    } else if (props["className"]) {
      setLanguage(props["className"].replace("lang-", ""));
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className={styles.container}>
      <span className={styles.icon} onClick={handleCopy}>
        {copied ? "copied" : <CopyIcon />}
      </span>
      <SyntaxHighlighter language={language} style={tomorrow}>
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
