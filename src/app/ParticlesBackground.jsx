"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true },
        background: {
          color: {
            value: "#000000", // 黑色背景
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse",
            },
            onClick: {
              enable: false, // 禁止push，粒子数量不增加
            },
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
        particles: {
          number: {
            value: 200, // 控制粒子数量，流畅
            density: {
              enable: true,
              area: 400,
            },
          },
          move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            random: true,
            straight: false,
            outModes: "out",
            trail: {
              enable: false, // 不要单独开trail，靠color gradient动效代替
            },
          },
          links: {
            enable: true,
            distance: 200,
            color: "#00faff", // ⚡ 注意这里只能是一个颜色！不能数组！
            opacity: {
              value: { min: 0.2, max: 0.5 }, // 呼吸动效
              animation: {
                enable: true,
                speed: 1,
                sync: false,
              },
            },
            width: 1.5,
          },
          color: {
            value: ["#00faff", "#00e5ff", "#007bff"], // 粒子本身可以渐变
            animation: {
              enable: true,
              speed: 5,
              sync: false,
            },
          },

          opacity: {
            value: 0.6,
            animation: {
              enable: true,
              speed: 0.8,
              minimumValue: 0.3,
              sync: false,
            },
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
            animation: {
              enable: true,
              speed: 3,
              minimumValue: 1,
              sync: false,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
