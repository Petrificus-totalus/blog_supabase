// ProjectCard.js
"use client";
import React from "react";
import styles from "./ProjectCard.module.css";
import Link from "next/link";

export default function ProjectCard({ project, position = "above" }) {
  const coverUrl = `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/${project.cover}`;

  return (
    <Link href={`/projects/${project.id}`} passHref>
      <div className={`${styles.card} ${styles[position]}`}>
        <span className={styles.dot}></span>
        <div className={styles.meta}>{project.duration}</div>
        <div className={styles.content}>
          <div className={styles.coverContainer}>
            <img src={coverUrl} alt="cover" className={styles.cover} />
          </div>
          <h3>{project.name}</h3>
          <p>{project.category}</p>
        </div>
      </div>
    </Link>
  );
}
