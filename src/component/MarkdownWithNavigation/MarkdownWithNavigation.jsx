// components/MarkdownWithNavigation.js
import { useEffect, useRef, useState } from "react";
import Markdown from "markdown-to-jsx";
import { motion } from "framer-motion";
import "./MarkdownWithNavigation.css";
import markdownOption from "@/app/markdownOption";

// ID生成工具函数
const generateHeadingId = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]/g, "-") // 保留中文、数字和字母
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const MarkdownWithNavigation = ({ mdContent, headings = [] }) => {
  const [activeId, setActiveId] = useState("");
  const observerRef = useRef(null);

  // 标准化标题数据
  const normalizedHeadings = headings.map((text) => ({
    id: generateHeadingId(text),
    text,
  }));

  // 初始化IntersectionObserver
  useEffect(() => {
    if (normalizedHeadings.length === 0) return;

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
          setActiveId(entry.target.id);
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "0px 0px -50% 0px", // 扩大检测区域
      threshold: 0.1,
    });

    // 绑定观察目标
    normalizedHeadings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        // 添加定位补偿（根据实际header高度调整）
        element.style.scrollMarginTop = "80px";
        observerRef.current.observe(element);
      }
    });

    return () => observerRef.current?.disconnect();
  }, [normalizedHeadings]);

  // 处理导航点击
  const handleNavClick = (id, e) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const top = target.offsetTop - 60; // 根据实际header高度调整
      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="markdown-container">
      <motion.nav
        className="scroll-nav"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        {normalizedHeadings.map(({ id, text }) => (
          <motion.a
            key={id}
            href={`#${id}`}
            onClick={(e) => handleNavClick(id, e)}
            className={`nav-item ${activeId === id ? "active" : ""}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {activeId === id && (
              <motion.span className="nav-highlight" layoutId="nav-highlight" />
            )}
            <span className="nav-text">{text}</span>
          </motion.a>
        ))}
      </motion.nav>

      <motion.div
        className="markdown-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Markdown
          options={{
            ...markdownOption,
            overrides: {
              ...markdownOption.overrides,
              h1: {
                component: ({ children }) => {
                  const titleText = children[0];
                  const matchedId = generateHeadingId(titleText);
                  return (
                    <h1 id={matchedId} className="md-heading">
                      {children}
                    </h1>
                  );
                },
              },
            },
          }}
        >
          {mdContent}
        </Markdown>
      </motion.div>
    </div>
  );
};

export default MarkdownWithNavigation;
