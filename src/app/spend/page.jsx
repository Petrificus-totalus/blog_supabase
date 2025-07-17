// app/spend/page.jsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import moment from "moment";
import FancyCard from "@/component/Spend/FancyCard/FancyCard";
import FancyTag from "@/component/Spend/FancyTag/FancyTag";
import ImageCarousel from "@/component/Spend/ImageCarousel/ImageCarousel";
import styles from "./spend.module.css";

export default function Spend() {
  const [transactions, setTransactions] = useState([]);
  const [grouped, setGrouped] = useState(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .range((currentPage - 1) * 10, currentPage * 10 - 1);

    if (error) {
      console.error("Fetch error", error);
      setLoading(false);
      return;
    }

    setTransactions(data || []);
    groupByDate(data || []);
    setLoading(false);
  };

  const groupByDate = (data) => {
    const map = new Map();
    data.forEach((tx) => {
      const date = moment(tx.created_at).format("YYYY-MM-DD");
      if (!map.has(date)) map.set(date, []);
      map.get(date).push(tx);
    });
    setGrouped(map);
  };

  const showModal = (tx) => {
    setCurrent(tx);
    setIsModalVisible(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
          Prev
        </button>
        <button onClick={() => setCurrentPage((p) => p + 1)}>Next</button>
      </div>

      {[...grouped.entries()].map(([date, list]) => (
        <FancyCard
          key={date}
          title={date}
          total={list.reduce((sum, tx) => sum + tx.price, 0).toFixed(2)}
        >
          <div className={styles.txList}>
            {list.map((tx) => (
              <div className={styles.txRow} key={tx.id}>
                <div className={styles.left}>
                  <div className={styles.title}>{tx.title}</div>
                  <div className={styles.meta}>{tx.location}</div>
                </div>
                <div className={styles.right}>
                  <div className={styles.price}>¥{tx.price.toFixed(2)}</div>
                  <div className={styles.tags}>
                    {tx.tags?.map((tag) => (
                      <FancyTag key={tag}>{tag}</FancyTag>
                    ))}
                  </div>
                  {(tx.links?.length || tx.description) && (
                    <button
                      className={styles.viewBtn}
                      onClick={() => showModal(tx)}
                    >
                      View
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </FancyCard>
      ))}

      {isModalVisible && current && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsModalVisible(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {current?.links?.length > 0 && (
              <ImageCarousel
                images={current.links.map(
                  (img) =>
                    `https://myblogprobiotics.s3.ap-southeast-2.amazonaws.com/${img}`
                )}
              />
            )}
            {current?.description && (
              <p className={styles.desc}>{current.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
