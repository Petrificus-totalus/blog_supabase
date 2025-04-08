"use client";
import { useEffect, useState } from "react";
import { fetchAllDishes } from "@/lib/dishApi";
import styles from "./dish.module.css";

export default function Dish() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDishes = async () => {
      try {
        const data = await fetchAllDishes();
        setDishes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDishes();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🍽 所有菜品</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {dishes.map((dish) => (
          <li
            key={dish.id}
            style={{
              marginBottom: "2rem",
              border: "1px solid #ccc",
              padding: "1rem",
            }}
          >
            <h2>{dish.name}</h2>
            <p>
              <strong>种类:</strong> {dish.category?.join(", ")}
            </p>
            {dish.image && (
              <img
                src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}dish/${dish.image}`}
                alt={dish.name}
                style={{ maxWidth: "300px" }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
