"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { fetchLearnByCategory } from "@/lib/learnApi";

export default function LearnByCategory() {
  const params = usePathname();
  const router = useRouter();

  const parts = params.split("/");
  const category = parts[parts.length - 1];

  const [learnItems, setLearnItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLearn = async () => {
      if (!category) return;
      try {
        const data = await fetchLearnByCategory(category);
        setLearnItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLearn();
  }, [category]);
  const showDetail = (id) => {
    router.push(`/learn/item/${id}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📚 分类: {category}</h1>
      {learnItems.length === 0 ? (
        <p>没有找到该分类的学习资源。</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {learnItems.map((item) => (
            <li
              key={item.id}
              style={{
                border: "1px solid #ddd",
                marginBottom: "1rem",
                padding: "1rem",
                borderRadius: "6px",
              }}
              onClick={() => showDetail(item.id)}
            >
              <h2>{item.title}</h2>
              <p>
                <strong>描述:</strong> {item.des?.join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
