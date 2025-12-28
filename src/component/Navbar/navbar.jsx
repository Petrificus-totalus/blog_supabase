"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import styles from "./Sidebar.module.css";

const MENU = [
  { href: "/", icon: "/logo.jpg", label: "Home :)" },
  {
    href: "/flower",
    icon: "/flower.png",
    label: "Beautiful flowers I delivered",
  },
  { href: "/projects", icon: "/projects.png", label: "Websites I developed" },
  { href: "/cook", icon: "/cook.png", label: "I'm so hungry... I wanna eat!" },
  { href: "/spend", icon: "/wallet.png", label: "Where all my money goes" },
  { href: "/learn", icon: "/book.png", label: "Live and learn" },
];

export default function VerticalNavbar() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const burgerRef = useRef(null);

  const closeMenu = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 400);
  };

  useEffect(() => {
    if ((open || closing) && burgerRef.current) {
      const rect = burgerRef.current.getBoundingClientRect();
      document.documentElement.style.setProperty(
        "--burger-x",
        `${rect.left + rect.width / 2}px`
      );
      document.documentElement.style.setProperty(
        "--burger-y",
        `${rect.top + rect.height / 2}px`
      );
    }
  }, [open, closing]);

  return (
    <>
      {/* ===== Desktop Sidebar ===== */}
      <div className={styles.navbarContainer}>
        <div className={styles.sidebar}>
          {MENU.map((item) => (
            <div key={item.href} className={styles.iconWrapper}>
              <Link href={item.href} className={styles.iconItem}>
                <img src={item.icon} alt={item.label} />
              </Link>
              <div className={styles.tooltip}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Mobile Burger ===== */}
      <button
        ref={burgerRef}
        className={`${styles.burger} ${open ? styles.open : ""}`}
        onClick={() => (open ? closeMenu() : setOpen(true))}
      >
        <span />
        <span />
        <span />
      </button>

      {/* ===== Overlay Menu ===== */}
      {(open || closing) && (
        <div className={styles.overlay} onClick={closeMenu}>
          <div
            className={`${styles.overlayBg} ${closing ? styles.shrink : ""}`}
          />
          {open && !closing && (
            <div className={styles.overlayMenu}>
              {MENU.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
