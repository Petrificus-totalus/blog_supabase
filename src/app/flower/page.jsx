"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import styles from "./flower.module.css";

export default function FlowerGallery() {
  const [flowers, setFlowers] = useState([]);
  const [orients, setOrients] = useState({}); // id => "portrait" | "landscape"

  useEffect(() => {
    async function fetchFlowers() {
      let { data, error } = await supabase.from("flower").select("*");
      if (!error) setFlowers(data);
    }
    fetchFlowers();
  }, []);

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
          . Each bouquet was carefully selected and wrapped with love. Seeing
          these beautiful blooms always lifts my spirits — I hope they brought
          the same joy to the people who received them 🌷
        </p>
      </div>

      <div className={styles.masonry}>
        {flowers.map((flower) => (
          <div
            key={flower.id}
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
    </div>
  );
}
