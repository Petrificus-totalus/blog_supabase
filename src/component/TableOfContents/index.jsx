"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./toc.module.css"; // 引入样式
import { slugify } from "@/lib/util";

export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState("");
  // 锁：防止点击跳转时 observer 再次触发导致的跳动
  const isClickScrolling = useRef(false);

  // 预处理数据
  const toc = (headings || []).map((t) => ({
    text: t,
    id: slugify(t),
  }));

  // === 1. 点击跳转逻辑 ===
  const scrollTo = (id) => {
    isClickScrolling.current = true;
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);

    // 1秒后解锁，恢复自动监听
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000);
  };

  // === 2. 自动高亮逻辑 (IntersectionObserver) ===
  useEffect(() => {
    if (!toc.length) return;

    // 这里的逻辑是：观察所有标题，当标题进入“屏幕上方区域”时，设为激活
    const callback = (entries) => {
      if (isClickScrolling.current) return;

      entries.forEach((entry) => {
        // isIntersecting 为 true 表示元素进入了我们设定的区域
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    // rootMargin 是核心技巧："-80px 0px -60% 0px"
    // 意思是在屏幕顶部划一个区域，避开顶部Header(80px)，只关注上半屏
    const observer = new IntersectionObserver(callback, {
      rootMargin: "-80px 0px -60% 0px",
      threshold: 0,
    });

    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  // === 3. 初始化 Hash 处理 ===
  useEffect(() => {
    const hash = decodeURIComponent(location.hash.replace("#", ""));
    if (hash) {
      setActiveId(hash);
      // 稍微延迟滚动，等待页面渲染完毕
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  return (
    <aside className={styles.toc}>
      <div className={styles.tocTitle}>On this page</div>
      {toc.map((h) => (
        <button
          key={h.id}
          className={`${styles.tocItem} ${
            activeId === h.id ? styles.tocActive : ""
          }`}
          onClick={() => scrollTo(h.id)}
        >
          {h.text}
        </button>
      ))}
    </aside>
  );
}
