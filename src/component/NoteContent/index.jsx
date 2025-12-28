"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Code from "@/component/Code/code"; // 确保你原本的Code组件路径正确
import { slugify } from "@/lib/util";
import styles from "./content.module.css"; // 引入样式

// =================================================================
// 【关键】必须定义在组件外面！
// 这样 React 才知道这些组件没有变，不需要卸载重装，从而消除了闪烁。
// =================================================================
const MARKDOWN_COMPONENTS = {
  h2: ({ children }) => {
    const text = String(children);
    return (
      <h2 id={slugify(text)} className={styles.h2}>
        {children}
      </h2>
    );
  },
  code: ({ inline, className, children }) =>
    inline ? (
      <code className={styles.codeInline}>{children}</code>
    ) : (
      <Code className={className}>{String(children).replace(/\n$/, "")}</Code>
    ),
  // 你可以根据需要添加 p, img 等其他优化
};

const NoteContent = memo(
  function NoteContent({ content }) {
    return (
      <article className={styles.content}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={MARKDOWN_COMPONENTS} // 传入稳定的配置对象
        >
          {content || ""}
        </ReactMarkdown>
      </article>
    );
  },
  (prev, next) => prev.content === next.content
); // 只有内容变了才重绘

export default NoteContent;
