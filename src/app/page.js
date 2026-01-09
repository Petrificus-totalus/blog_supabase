"use client";

import BookSection from "@/component/Book/BookSection";
import Section from "./Section";
import styles from "./page.module.css";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import Portfolio from "@/component/Portfolio/Portfolio";
import Travel from "@/component/Travel/travel";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <motion.div
          className={styles.hero}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className={styles.title}>
            <span className={styles.typewriter}>
              <Typewriter
                words={[" Hi, I'm Nanhao", "A Web Developer"]}
                loop={true}
                cursor
                cursorStyle="_"
                typeSpeed={80}
                deleteSpeed={60}
                delaySpeed={2000}
              />
            </span>
          </h1>

          <a href="#learn" className={styles.cta}>
            Explore My World
          </a>
        </motion.div>
        <BookSection />
        <Portfolio />
        <Travel />

        <Section title="My Cooking">
          <p>My Cooking...</p>
        </Section>

        {/* 花艺页面 */}
        <Section title="Flowers I've Delivered">
          <p>Flowers I've Delivered...</p>
        </Section>
      </main>
    </div>
  );
}
