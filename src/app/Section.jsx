"use client";

import { motion } from "framer-motion";
import styles from "./page.module.css";

export default function Section({ title, children, id }) {
  return (
    <motion.section
      id={id}
      className={styles.section}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionContent}>{children}</div>
    </motion.section>
  );
}
