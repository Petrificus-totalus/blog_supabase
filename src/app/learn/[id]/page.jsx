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

    // 清理旧 observer
    observerRef.current?.disconnect();

    let rafId = 0;

    const io = new IntersectionObserver(
      (entries) => {
        // 选出当前最“可见”的那一个 heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        // 用 rAF 合并多次回调，避免频繁 setState 导致卡顿
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const nextId = visible.target.id;
          setActiveId((prev) => (prev === nextId ? prev : nextId));
        });
      },
      {
        root: null,
        // 让“靠近顶部的标题”更容易成为 active
        rootMargin: "-15% 0px -70% 0px",
        threshold: [0.05, 0.15, 0.3, 0.6],
      }
    );

    observerRef.current = io;

    // 关键：等 Markdown 渲染到 DOM 后再绑定 observe
    const bind = () => {
      toc.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) io.observe(el);
      });
    };

    // 双保险：requestAnimationFrame + setTimeout
    const t = setTimeout(() => {
      requestAnimationFrame(bind);
    }, 0);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(rafId);
      io.disconnect();
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
