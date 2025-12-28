"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/supabaseClient";
import { formatDate } from "@/lib/util";
import styles from "./noteDetail.module.css";

// 引入拆分后的组件
import NoteContent from "@/component/NoteContent";
import TableOfContents from "@/component/TableOfContents";

export default function NoteDetailPage() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

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
          {/* 目录组件：独立处理高亮 */}
          <TableOfContents headings={note.summary_lines} />

          {/* 内容组件：静态渲染，不会因为目录变动而重绘 */}
          <NoteContent content={note.content_md} />
        </div>
      </section>
    </main>
  );
}
