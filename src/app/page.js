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
            Hi, I'm&nbsp;
            <span className={styles.typewriter}>
              <Typewriter
                words={["Your Name", "An Explorer", "A Dreamer"]}
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
          <p>写你的学习背景、学校、专业、学到的技能...</p>
        </Section>

        <Section title="My Cooking">
          <p>分享你做的菜肴、烘焙、生活记录...</p>
        </Section>

        <Section title="My Projects">
          <p>列出你开发的应用、小项目、网站等等...</p>
        </Section>

        {/* 花艺页面 */}
        <Section title="Flowers I've Delivered">
          <p>分享你的花艺照片、经历、链接到花艺页...</p>
        </Section>
      </main>
    </div>
  );
}
