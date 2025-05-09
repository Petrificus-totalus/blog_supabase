"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchLearnById } from "@/lib/learnApi";
import MarkdownWithNavigation from "@/component/MarkdownWithNavigation/MarkdownWithNavigation";

export default function LearnById() {
  const params = usePathname();
  const parts = params.split("/");
  const id = parts[parts.length - 1];

  const [learnItem, setLearnItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLearn = async () => {
      if (!id) return;
      try {
        const data = await fetchLearnById(id);

        setLearnItem(data?.[0] || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLearn();
  }, [id]);

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "4rem", fontSize: "1.2rem" }}>
        Loading...
      </p>
    );

  if (!learnItem) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "4rem",
          fontSize: "1.2rem",
          color: "#777",
        }}
      >
        没有找到该分类的学习资源。
      </div>
    );
  }

  return (
    <div>
      <div style={{ borderTop: "1px solid #eee" }}>
        <MarkdownWithNavigation
          title={learnItem.title}
          mdContent={learnItem.content}
          headings={learnItem.des}
        />
      </div>
    </div>
  );
}
