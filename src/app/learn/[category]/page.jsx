"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { fetchLearnByCategory } from "@/lib/learnApi";
import styles from "./category.module.css";

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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{category.toUpperCase()}</h1>
      {loading ? (
        <div className={styles.loader}></div>
      ) : learnItems.length === 0 ? (
        <p className={styles.empty}>No learning resources found.</p>
      ) : (
        <div className={styles.grid}>
          {learnItems.map((item) => (
            <div
              key={item.id}
              className={styles.card}
              onClick={() => showDetail(item.id)}
            >
              <h2>{item.title}</h2>
              <p>
                <strong>Description:</strong>{" "}
                {item.des?.length > 0 ? item.des.join(", ") : "No description"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
