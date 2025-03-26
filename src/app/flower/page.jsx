"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

export default function FlowerGallery() {
  const [flowers, setFlowers] = useState([]);

  useEffect(() => {
    async function fetchFlowers() {
      let { data, error } = await supabase.from("flower").select("*");
      if (!error) setFlowers(data);
    }
    fetchFlowers();
  }, []);

  return (
    <div>
      <h1>花的照片</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        {flowers.map((flower) => (
          <img
            key={flower.id}
            src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}flower/${flower.image_url}`}
            alt="Flower"
            style={{ width: "100%" }}
          />
        ))}
      </div>
    </div>
  );
}
