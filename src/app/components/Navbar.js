"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>✨</span>
          <span className={styles.logoText}>Inspiration Gallery</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          {user ? (
            <>
              <Link href="/gallery" className={styles.navLink}>
                <span style={{ marginRight: "0.5rem" }}>🖼️</span>
                My Gallery
              </Link>
              <Link href="/upload" className={styles.navLink}>
                <span style={{ marginRight: "0.5rem" }}>📤</span>
                Upload
              </Link>
              <div className={styles.userMenu}>
                <span className={styles.userName}>
                  <span style={{ marginRight: "0.5rem" }}>👋</span>
                  Hi, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className={`${styles.navLink} ${styles.logoutBtn}`}
                >
                  <span style={{ marginRight: "0.5rem" }}>🚪</span>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.navLink}>
                <span style={{ marginRight: "0.5rem" }}>🔐</span>
                Login
              </Link>
              <Link
                href="/register"
                className={`${styles.navLink} ${styles.registerBtn}`}
              >
                <span style={{ marginRight: "0.5rem" }}>📝</span>
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuBtn}
          onClick={toggleMenu}
          aria-label="Toggle mobile menu"
        >
          <div
            className={`${styles.hamburger} ${
              isMenuOpen ? styles.hamburgerOpen : ""
            }`}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.mobileMenuContent}>
              {user ? (
                <>
                  <Link
                    href="/gallery"
                    className={styles.mobileNavLink}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span style={{ marginRight: "0.5rem" }}>🖼️</span>
                    My Gallery
                  </Link>
                  <Link
                    href="/upload"
                    className={styles.mobileNavLink}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span style={{ marginRight: "0.5rem" }}>📤</span>
                    Upload
                  </Link>
                  <div className={styles.mobileUserInfo}>
                    <span className={styles.mobileUserName}>
                      <span style={{ marginRight: "0.5rem" }}>👋</span>
                      Hi, {user.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className={styles.mobileLogoutBtn}
                    >
                      <span style={{ marginRight: "0.5rem" }}>🚪</span>
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={styles.mobileNavLink}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span style={{ marginRight: "0.5rem" }}>🔐</span>
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className={`${styles.mobileNavLink} ${styles.mobileRegisterBtn}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span style={{ marginRight: "0.5rem" }}>📝</span>
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
