"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/supabaseClient";
import styles from "./flower.module.css";

const PAGE_SIZE = 10; // 每次加载10张

export default function FlowerGallery() {
  const [flowers, setFlowers] = useState([]);
  const [page, setPage] = useState(0); // 当前加载到第几页
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 是否还有更多数据
  const [orients, setOrients] = useState({});

  const observer = useRef();

  // 加载一页花图
  const fetchFlowers = useCallback(async () => {
    setLoading(true);
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    let { data, error } = await supabase
      .from("flower")
      .select("*")
      .order("id", { ascending: true })
      .range(from, to);
    if (!error) {
      setFlowers((prev) => [...prev, ...data]);
      console.log(data);

      if (data.length < PAGE_SIZE) setHasMore(false); // 如果这次返回数量不足一页，说明到底了
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchFlowers();
  }, [fetchFlowers]);

  const lastFlowerRef = useRef();

  useEffect(() => {
    if (loading) return;
    if (!hasMore) return;

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const callback = (entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    };

    const observerInstance = new IntersectionObserver(callback, options);
    if (lastFlowerRef.current) {
      observerInstance.observe(lastFlowerRef.current);
    }

    return () => {
      if (lastFlowerRef.current) {
        observerInstance.unobserve(lastFlowerRef.current);
      }
    };
  }, [loading, hasMore]);

  const handleImageLoad = (e, id) => {
    const { naturalWidth, naturalHeight } = e.target;
    const orientation = naturalHeight > naturalWidth ? "portrait" : "landscape";
    setOrients((prev) => ({ ...prev, [id]: orientation }));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.petalLayer}></div>

      <div className={styles.header}>
        <h1>Flowers I’ve Delivered</h1>
        <p>
          These are the flowers I’ve delivered on behalf of&nbsp;
          <a href="https://www.odetoflowers.com.au" target="_blank">
            Ode to Flowers
          </a>
          &nbsp;and&nbsp;
          <a href="https://www.mrroses.com.au" target="_blank">
            Mr Roses
          </a>
          . Each bouquet was carefully selected and wrapped with love...
        </p>
      </div>

      <div className={styles.masonry}>
        {flowers.map((flower, idx) => (
          <div
            key={flower.id}
            ref={idx === flowers.length - 1 ? lastFlowerRef : null} // 最后一个元素加上ref
            className={`${styles.card} ${
              orients[flower.id] === "portrait"
                ? styles.portrait
                : styles.landscape
            }`}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}flower/${flower.image_url}`}
              alt="Flower"
              onLoad={(e) => handleImageLoad(e, flower.id)}
            />
          </div>
        ))}
      </div>

      {loading && (
        <p style={{ textAlign: "center", marginTop: "1rem" }}>Loading...</p>
      )}
    </div>
  );
}
