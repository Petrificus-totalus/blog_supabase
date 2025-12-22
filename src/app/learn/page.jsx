"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./notes.module.css";
import { supabase } from "@/supabaseClient";

const PAGE_SIZE = 6;
const CATEGORIES = ["All", "Algorithm", "Data Structure", "CSS"];

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

// 防抖：避免每输入一个字就请求
function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function NotesPage() {
  const [currentCategory, setCurrentCategory] = useState("All");
  const [page, setPage] = useState(1);

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebouncedValue(keyword, 250);

  const [notes, setNotes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / PAGE_SIZE));
  }, [total]);

  // 切分类 / 变更搜索词 → 回到第一页
  useEffect(() => {
    setPage(1);
  }, [currentCategory, debouncedKeyword]);

  useEffect(() => {
    let alive = true;

    async function fetchNotes() {
      setLoading(true);

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("notes")
        .select("id,title,category,summary_lines,created_at", {
          count: "exact",
        })
        .order("created_at", { ascending: false });

      // 分类过滤
      if (currentCategory !== "All") {
        query = query.eq("category", currentCategory);
      }

      // 搜索过滤：title 或 summary_text 模糊匹配
      const kw = debouncedKeyword.trim();
      if (kw) {
        // 注意：summary_text 是我们在数据库里新增的拼接字段
        query = query.or(`title.ilike.%${kw}%,summary_text.ilike.%${kw}%`);
      }

      const { data, count, error } = await query.range(from, to);

      if (!alive) return;

      if (error) {
        console.error(error);
        setNotes([]);
        setTotal(0);
      } else {
        setNotes(data || []);
        setTotal(count || 0);
      }

      setLoading(false);
    }

    fetchNotes();
    return () => (alive = false);
  }, [currentCategory, debouncedKeyword, page]);

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <h1 className={styles.title}>Notes</h1>

        {/* Tabs + Search（同一行） */}
        <div className={styles.tabsRow}>
          <div className={styles.tabs}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`${styles.tab} ${
                  c === currentCategory ? styles.active : ""
                }`}
                onClick={() => setCurrentCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className={styles.searchWrap}>
            <input
              className={styles.searchInput}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search title or summary…"
            />
            {keyword ? (
              <button
                className={styles.clearBtn}
                onClick={() => setKeyword("")}
                aria-label="Clear search"
                type="button"
              >
                ×
              </button>
            ) : null}
          </div>
        </div>

        {/* Pager */}
        <div className={styles.pager}>
          <span>
            {currentCategory}
            {debouncedKeyword.trim() ? (
              <> · Search: “{debouncedKeyword.trim()}”</>
            ) : null}
            {" · "}共 {total} 条
          </span>

          <div className={styles.pagerBtns}>
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
              ←
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              →
            </button>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className={styles.loading}>Loading…</div>
        ) : (
          <div className={styles.list}>
            {notes.length === 0 ? (
              <div className={styles.empty}>No notes</div>
            ) : (
              notes.map((n) => (
                <article key={n.id} className={styles.card}>
                  <div className={styles.bar} />
                  <div className={styles.body}>
                    <div className={styles.top}>
                      <h2>{n.title}</h2>
                      <time>{formatDate(n.created_at)}</time>
                    </div>

                    <ul className={styles.summary}>
                      {(n.summary_lines || []).map((t, i) => (
                        <li key={i}>
                          <a href={`/notes/${n.id}#s-${i + 1}`}>{t}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </section>
    </main>
  );
}
