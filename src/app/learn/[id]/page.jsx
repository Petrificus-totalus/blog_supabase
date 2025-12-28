"use client";

import { useEffect, useMemo, useState } from "react";
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
      setNote(error ? null : data);
      setLoading(false);
    }

    if (id) fetchNote();
    return () => (alive = false);
  }, [id]);

  /** TOC 直接来自 summary_lines（你这个设计是最优的） */
  const toc = useMemo(
    () =>
      (note?.summary_lines || []).map((t) => ({
        text: t,
        id: slugify(t),
      })),
    [note?.summary_lines]
  );

  /** scroll + rAF 的目录高亮（稳定方案） */
  useEffect(() => {
    if (!toc.length) return;

    let ticking = false;
    const OFFSET = 110;

    const updateActive = () => {
      const items = toc
        .map(({ id }) => document.getElementById(id))
        .filter(Boolean);

      if (!items.length) return;

      let current = items[0].id;

      for (const el of items) {
        if (el.getBoundingClientRect().top - OFFSET <= 0) {
          current = el.id;
        } else break;
      }

      setActiveId((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [toc]);

  /** hash 进入 */
  useEffect(() => {
    if (!note) return;
    const hash = decodeURIComponent(location.hash.replace("#", ""));
    if (!hash) return;
    setActiveId(hash);
    setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }, [note]);

  const scrollTo = (id) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  if (loading) return <div className={styles.loading}>Loading…</div>;
  if (!note) return <div className={styles.loading}>Not found</div>;

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
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
        </header>

        <div className={styles.layout}>
          {/* TOC */}
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

          {/* Content */}
          <article className={styles.content}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
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
                    <Code className={className}>
                      {String(children).replace(/\n$/, "")}
                    </Code>
                  ),
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
