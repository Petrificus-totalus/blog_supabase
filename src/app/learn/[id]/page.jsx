"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./noteDetail.module.css";
import { supabase } from "@/supabaseClient";
import Code from "@/component/Code/code";
import { slugify, formatDate } from "@/lib/util";

export default function NoteDetailPage() {
  const { id } = useParams();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeId, setActiveId] = useState("");
  const observerRef = useRef(null);

  useEffect(() => {
    let alive = true;

    async function fetchNote() {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("id,title,created_at,tags,summary_lines,content_md")
        .eq("id", id)
        .single();

      if (!alive) return;

      if (error) {
        console.error(error);
        setNote(null);
      } else {
        setNote(data);
      }
      setLoading(false);
    }

    if (id) fetchNote();
    return () => (alive = false);
  }, [id]);

  const toc = useMemo(() => {
    return (note?.summary_lines || []).map((text) => ({
      text,
      id: slugify(text),
    }));
  }, [note?.summary_lines]);

  // 监听滚动，高亮当前 section
  useEffect(() => {
    if (!toc.length) return;

    let ticking = false;

    const getActive = () => {
      // 找到所有 toc 对应的 h2 元素
      const items = toc
        .map(({ id }) => document.getElementById(id))
        .filter(Boolean);

      if (items.length === 0) return;

      // 顶部偏移（你有 sticky toc/可能还有 header，就给一点缓冲）
      const OFFSET = 110;

      // 找到“已经滚过顶部”的最后一个标题（最常见的目录高亮逻辑）
      let current = items[0].id;

      for (const el of items) {
        const top = el.getBoundingClientRect().top;
        if (top - OFFSET <= 0) current = el.id;
        else break; // 后面的更靠下，不需要看了
      }

      setActiveId((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        getActive();
        ticking = false;
      });
    };

    // 初次进入先算一次
    getActive();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [toc]);

  // 初次进入：如果 URL 有 hash，则滚动到对应标题
  useEffect(() => {
    if (!note) return;
    const hash = decodeURIComponent(window.location.hash || "").replace(
      "#",
      ""
    );
    if (!hash) return;
    setActiveId(hash);
    // 等渲染完再滚
    const t = setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);

    return () => clearTimeout(t);
  }, [note]);

  const scrollToId = (id) => {
    setActiveId(id); // ✅ 关键：先高亮
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  if (loading) return <div className={styles.loading}>Loading…</div>;
  if (!note) return <div className={styles.loading}>Not found</div>;

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.header}>
          <div className={styles.meta}>
            <div className={styles.tags}>
              {(note.tags || []).slice(0, 3).map((t) => (
                <span key={t} className={styles.tag}>
                  {t}
                </span>
              ))}
            </div>
            <time className={styles.date}>{formatDate(note.created_at)}</time>
          </div>

          <h1 className={styles.title}>{note.title}</h1>
        </div>

        <div className={styles.layout}>
          {/* TOC */}
          <aside className={styles.toc}>
            <div className={styles.tocTitle}>On this page</div>
            {toc.length === 0 ? (
              <div className={styles.tocEmpty}>No headings</div>
            ) : (
              toc.map((h) => (
                <button
                  key={h.id}
                  className={`${styles.tocItem} ${
                    activeId === h.id ? styles.tocActive : ""
                  }`}
                  onClick={() => scrollToId(h.id)}
                >
                  {h.text}
                </button>
              ))
            )}
          </aside>

          {/* Markdown */}
          <article className={styles.content}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => {
                  const text = String(children);
                  const id = slugify(text);
                  return (
                    <h2 id={id} className={styles.h2}>
                      {children}
                    </h2>
                  );
                },

                code: ({ inline, className, children }) => {
                  if (inline) {
                    return (
                      <code className={styles.codeInline}>{children}</code>
                    );
                  }

                  // ✅ 多行代码块 → 走你自己的 Code 组件
                  return (
                    <Code className={className}>
                      {String(children).replace(/\n$/, "")}
                    </Code>
                  );
                },
              }}
            >
              {note.content_md || ""}
            </ReactMarkdown>
          </article>
        </div>
      </section>
    </main>
  );
}
