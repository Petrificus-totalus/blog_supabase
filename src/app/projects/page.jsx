"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./page.module.css";
import { fetchAllProjects } from "@/lib/projectApi";
import ProjectCard from "@/component/ProjectCard/ProjectCard";

export default function ProjectTimeline() {
  const [projects, setProjects] = useState([]);
  const [timelineVisible, setTimelineVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const timelineRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchAllProjects();
        setProjects(res);
        setTimelineVisible(true);
        setTimeout(() => {
          setCardsVisible(true);
        }, 1000);
      } catch (error) {
        console.error("Error loading projects:", error);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          load();
        }
      },
      { threshold: 0.1 }
    );

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => {
      if (timelineRef.current) {
        observer.unobserve(timelineRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Project <span className={styles.highlight}>Timeline</span>
        </h1>
        <p className={styles.subtitle}>
          Explore our journey through innovative projects
        </p>
      </div>

      <div className={styles.scrollContainer}>
        <div
          className={styles.timelineWrapper}
          ref={timelineRef}
          style={{ paddingLeft: "180px" }}
        >
          <div
            className={`${styles.timeline} ${
              timelineVisible ? styles.visible : ""
            }`}
          >
            <div className={styles.arrowHead}></div>
            <div
              className={styles.line}
              style={{ width: `${projects.length * 480 + 200}px` }}
            ></div>
            <div className={styles.particles}>
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={styles.particle}
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random() * 3}s`,
                  }}
                ></div>
              ))}
            </div>
            <div className={styles.timelineNodes}>
              {projects.map((p, i) => (
                <div
                  key={p.id}
                  className={`${styles.node} ${
                    cardsVisible ? styles.active : ""
                  }`}
                  style={{
                    left: `${i * 480}px`,
                    animationDelay: `${i * 0.2 + 0.5}s`,
                  }}
                >
                  <div className={styles.nodeDot}></div>
                  <div className={styles.nodeLabel}>{p.duration}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.projects}>
            {projects.map((p, i) => (
              <div
                key={p.id}
                className={`${styles.projectWrapper} ${
                  cardsVisible ? styles.visible : ""
                }`}
                style={{
                  left: `${i * 480}px`,
                  animationDelay: `${i * 0.3 + 0.5}s`,
                  top: i % 2 === 0 ? "-80px" : "80px",
                }}
              >
                <ProjectCard
                  project={p}
                  position={i % 2 === 0 ? "above" : "below"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
