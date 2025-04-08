"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchLearnById } from "@/lib/learnApi";
import markdownOptions from "@/app/markdownOption";
import Markdown from "markdown-to-jsx";
import Code from "@/component/Code/code";

export default function LearnById() {
  const params = usePathname();

  const parts = params.split("/");
  const id = parts[parts.length - 1];

  const [learnItems, setLearnItem] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLearn = async () => {
      if (!id) return;
      try {
        const data = await fetchLearnById(id);
        setLearnItem(data);
        console.log(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLearn();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
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
            >
              <h2>{item.title}</h2>
              <p>
                <strong>描述:</strong> {item.des?.join(", ")}
              </p>
              <div>
                <strong>内容:</strong>
                <Markdown options={markdownOptions}>{item.content}</Markdown>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
