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
    if (!props.className) return;
    const m = props.className.match(/language-(\w+)/);
    if (m) setLanguage(m[1]);
  }, [props.className]);

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
      <span className={styles.icon} onClick={handleCopy} data-copied={copied}>
        {!copied && <CopyIcon />}
        {copied && <span className={styles.copiedText}>Copied!</span>}
      </span>
      {language && <span className={styles.languageLabel}>{language}</span>}
      <SyntaxHighlighter
        language={language}
        style={tomorrow}
        showLineNumbers
        lineNumberStyle={{
          color: "rgba(255,255,255,0.3)",
          paddingRight: "1.5em",
        }}
        wrapLines
        lineProps={{ style: { transition: "all 0.3s" } }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
