"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./notes.module.css";
import { supabase } from "@/supabaseClient";

const PAGE_SIZE = 6;

/** 你写死的标签体系：一级 -> 二级 */
const PRIMARY_TABS = ["All", "Algorithm", "Data Structure", "CSS", "JS"];

const SUB_TABS = {
  Algorithm: [
    "Greedy",
    "Backtracking",
    "DynamicP",
    "Two Pointers",
    "Binary Search",
    "Sliding Window",
  ],
  "Data Structure": [
    "Array",
    "List",
    "Tree",
    "Graph",
    "Stack",
    "Queue",
    "Hash Map",
  ],
  CSS: ["Grid", "Flex", "Layout", "Animation", "Responsive"],
  JS: ["Async", "Promise", "Closure", "Array Methods", "DOM"],
  All: [],
};

/** 同标签同颜色（你写死） */
const TAG_STYLE = {
  Algorithm: "tagGreen",
  Greedy: "tagGreen",
  Backtracking: "tagGreen",
  DynamicP: "tagGreen",
  "Two Pointers": "tagGreen",
  "Binary Search": "tagGreen",
  "Sliding Window": "tagGreen",

  "Data Structure": "tagBrown",
  Array: "tagBrown",
  List: "tagBrown",
  Tree: "tagBrown",
  Graph: "tagBrown",
  Stack: "tagBrown",
  Queue: "tagBrown",
  "Hash Map": "tagBrown",

  CSS: "tagBlue",
  Grid: "tagBlue",
  Flex: "tagBlue",
  Layout: "tagBlue",
  Animation: "tagBlue",
  Responsive: "tagBlue",

  JS: "tagPurple",
  Async: "tagPurple",
  Promise: "tagPurple",
  Closure: "tagPurple",
  "Array Methods": "tagPurple",
  DOM: "tagPurple",
};

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function NotesPage() {
  const [primary, setPrimary] = useState("All");
  const [sub, setSub] = useState("All"); // 二级选中项（All=不过滤）
  const [page, setPage] = useState(1);

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebouncedValue(keyword, 250);

  const [notes, setNotes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total]
  );

  // 主/子/搜索变化 -> 回第一页
  useEffect(() => {
    setPage(1);
  }, [primary, sub, debouncedKeyword]);

  // 切主标签时，子标签重置
  useEffect(() => {
    setSub("All");
  }, [primary]);

  useEffect(() => {
    let alive = true;

    async function fetchNotes() {
      setLoading(true);

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("notes")
        .select("id,title,tags,summary_lines,created_at", { count: "exact" })
        .order("created_at", { ascending: false });

      // 一级过滤
      if (primary !== "All") {
        query = query.contains("tags", [primary]);
      }

      // 二级过滤（要求同时包含 primary + sub）
      if (primary !== "All" && sub !== "All") {
        query = query.contains("tags", [primary, sub]);
      }

      // 搜索过滤：title 或 summary_text 模糊匹配
      const kw = debouncedKeyword.trim();
      if (kw) {
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
  }, [primary, sub, debouncedKeyword, page]);

  const subTabs = SUB_TABS[primary] || [];

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <h1 className={styles.title}>Notes</h1>

        {/* 主 Tabs + Search */}
        <div className={styles.tabsRow}>
          <div className={styles.tabs}>
            {PRIMARY_TABS.map((t) => (
              <button
                key={t}
                className={`${styles.tab} ${
                  t === primary ? styles.active : ""
                }`}
                onClick={() => setPrimary(t)}
              >
                {t}
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
                type="button"
              >
                ×
              </button>
            ) : null}
          </div>
        </div>

        {/* 二级 Tabs：只有选了某个主标签才显示 */}
        {primary !== "All" ? (
          <div className={styles.subTabs}>
            <button
              className={`${styles.subTab} ${
                sub === "All" ? styles.subActive : ""
              }`}
              onClick={() => setSub("All")}
            >
              All
            </button>

            {subTabs.map((t) => (
              <button
                key={t}
                className={`${styles.subTab} ${
                  sub === t ? styles.subActive : ""
                }`}
                onClick={() => setSub(t)}
              >
                {t}
              </button>
            ))}
          </div>
        ) : null}

        {/* Pager */}
        <div className={styles.pager}>
          <span>
            {primary}
            {primary !== "All" && sub !== "All" ? ` / ${sub}` : ""}
            {debouncedKeyword.trim()
              ? ` · Search: “${debouncedKeyword.trim()}”`
              : ""}
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
                  <div className={styles.bar} aria-hidden="true" />

                  <div className={styles.body}>
                    {/* 顶部一行：多标签 + 日期 */}
                    <div className={styles.cardTopRow}>
                      <div className={styles.tagRow}>
                        {(n.tags || []).map((tag) => {
                          const cls = TAG_STYLE[tag] || "tagDefault";
                          return (
                            <span
                              key={tag}
                              className={`${styles.tag} ${styles[cls]}`}
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                      <time className={styles.date}>
                        {formatDate(n.created_at)}
                      </time>
                    </div>

                    <h2 className={styles.cardTitle}>{n.title}</h2>

                    <ul className={styles.summary}>
                      {(n.summary_lines || []).slice(0, 4).map((t, i) => (
                        <li key={i}>
                          <a
                            className={styles.summaryLink}
                            href={`/notes/${n.id}#s-${i + 1}`}
                          >
                            {t}
                          </a>
                        </li>
                      ))}
                    </ul>

                    {(n.summary_lines || []).length > 4 ? (
                      <div className={styles.more}>
                        +{n.summary_lines.length - 4} more
                      </div>
                    ) : null}
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
