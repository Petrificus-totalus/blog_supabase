"use client";

import ParticlesBackground from "./ParticlesBackground";
import Section from "./Section";
import styles from "./page.module.css";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

export default function Home() {
  return (
    <div className={styles.container}>
      <ParticlesBackground />

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

        <Section id="learn" title="My Learning Journey">
          <p>My Learning Journey...</p>
        </Section>

        <Section title="My Cooking">
          <p>My Cooking...</p>
        </Section>

        <Section title="My Projects">
          <p>My Projects...</p>
        </Section>

        {/* 花艺页面 */}
        <Section title="Flowers I've Delivered">
          <p>Flowers I've Delivered...</p>
        </Section>
      </main>
    </div>
  );
}
