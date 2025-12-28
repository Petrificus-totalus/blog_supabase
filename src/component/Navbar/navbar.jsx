"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import styles from "./Sidebar.module.css";

const MENU = [
  { href: "/", icon: "/logo.jpg", label: "Home :)", sub: "Back to homepage" },
  {
    href: "/flower",
    icon: "/flower.png",
    label: "Beautiful flowers I delivered",
    sub: "Gallery & stories",
  },
  {
    href: "/projects",
    icon: "/projects.png",
    label: "Websites I developed",
    sub: "Portfolio & cases",
  },
  {
    href: "/cook",
    icon: "/cook.png",
    label: "I'm so hungry... I wanna eat!",
    sub: "Food & reviews",
  },
  {
    href: "/spend",
    icon: "/wallet.png",
    label: "Where all my money goes",
    sub: "Expenses & tracking",
  },
  { href: "/learn", icon: "/book.png", label: "Live and learn", sub: "Notes" },
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
    }, 400); // 和圆形收缩动画一致
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
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <span />
        <span />
        <span />
      </button>

      {/* ===== Overlay Menu (Mobile) ===== */}
      {(open || closing) && (
        <div className={styles.overlay} onClick={closeMenu} role="presentation">
          {/* 黑色圆形扩散背景（保留） */}
          <div
            className={`${styles.overlayBg} ${closing ? styles.shrink : ""}`}
            aria-hidden="true"
          />

          {/* 菜单卡片层（点卡片不要触发 overlay onClick） */}
          {open && !closing && (
            <div
              className={styles.overlayMenu}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.overlayHeader}>
                <div className={styles.overlayTitle}>Menu</div>
                <div className={styles.overlayHint}>Tap to navigate</div>
              </div>

              <div className={styles.menuList}>
                {MENU.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={styles.menuCard}
                    style={{ animationDelay: `${0.18 + i * 0.06}s` }}
                  >
                    <span className={styles.menuIcon} aria-hidden="true">
                      <img src={item.icon} alt="" />
                    </span>

                    <span className={styles.menuText}>
                      <span className={styles.menuLabel}>{item.label}</span>
                      <span className={styles.menuSub}>{item.sub}</span>
                    </span>

                    <span className={styles.chevron} aria-hidden="true">
                      ›
                    </span>
                  </Link>
                ))}
              </div>

              <button className={styles.closeBtn} onClick={closeMenu}>
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
