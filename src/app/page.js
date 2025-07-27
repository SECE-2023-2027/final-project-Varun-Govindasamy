"use client";

import { useAuth } from "./context/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageContainer}>
        <motion.section
          className={styles.hero}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.25, 0, 1] }}
        >
          <div className={styles.heroContent}>
            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.25, 0, 1] }}
            >
              <span style={{ fontSize: "0.8em", marginRight: "0.5rem" }}>
                ✨
              </span>
              Your Personal
              <span className={styles.gradient}> Inspiration Gallery</span>
            </motion.h1>

            <motion.p
              className={styles.heroDescription}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.25, 0, 1] }}
            >
              <span style={{ marginRight: "0.5rem" }}>🎨</span>
              Capture, organize, and revisit the moments, images, and ideas that
              inspire you most. Build your personal collection of creativity and
              motivation.
            </motion.p>

            <motion.div
              className={styles.heroActions}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.25, 0, 1] }}
            >
              {user ? (
                <>
                  <Link href="/gallery" className="btn btn-primary">
                    <span style={{ marginRight: "0.5rem" }}>🖼️</span>
                    View My Gallery
                  </Link>
                  <Link href="/upload" className="btn btn-secondary">
                    <span style={{ marginRight: "0.5rem" }}>➕</span>
                    Add Inspiration
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register" className="btn btn-primary">
                    <span style={{ marginRight: "0.5rem" }}>🚀</span>
                    Get Started
                  </Link>
                  <Link href="/login" className="btn btn-secondary">
                    <span style={{ marginRight: "0.5rem" }}>🔑</span>
                    Sign In
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          <motion.div
            className={styles.heroVisual}
            initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.25, 0, 1] }}
          >
            <div className={styles.galleryPreview}>
              <motion.div
                className={styles.previewCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                whileHover={{
                  scale: 1.02,
                  rotateY: 2,
                  transition: { duration: 0.3 },
                }}
              >
                <div className={styles.previewImage}></div>
                <div className={styles.previewContent}>
                  <div className={styles.previewTitle}></div>
                  <div className={styles.previewTags}>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className={styles.previewCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                whileHover={{
                  scale: 1.05,
                  rotateY: -3,
                  transition: { duration: 0.3 },
                }}
              >
                <div className={styles.previewImage}></div>
                <div className={styles.previewContent}>
                  <div className={styles.previewTitle}></div>
                  <div className={styles.previewTags}>
                    <span></span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className={styles.previewCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 3,
                  transition: { duration: 0.3 },
                }}
              >
                <div className={styles.previewImage}></div>
                <div className={styles.previewContent}>
                  <div className={styles.previewTitle}></div>
                  <div className={styles.previewTags}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          className={styles.features}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
        >
          <motion.h2
            className={styles.featuresTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Everything you need to stay inspired
          </motion.h2>

          <div className={styles.featuresGrid}>
            <motion.div
              className={styles.featureCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3, ease: [0.25, 0.25, 0, 1] },
              }}
            >
              <div className={styles.featureIcon}>📸</div>
              <h3>📁 Capture Moments</h3>
              <p>
                Upload images, quotes, and media that inspire you. Organize them
                with custom tags and descriptions.
              </p>
            </motion.div>

            <motion.div
              className={styles.featureCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3, ease: [0.25, 0.25, 0, 1] },
              }}
            >
              <div className={styles.featureIcon}>🏷️</div>
              <h3>🔍 Smart Organization</h3>
              <p>
                Tag and categorize your inspirations. Search and filter to
                quickly find exactly what you need.
              </p>
            </motion.div>

            <motion.div
              className={styles.featureCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3, ease: [0.25, 0.25, 0, 1] },
              }}
            >
              <div className={styles.featureIcon}>💫</div>
              <h3>🖼️ Beautiful Gallery</h3>
              <p>
                View your inspirations in a stunning, responsive gallery
                designed to showcase your creativity.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {!user && (
          <motion.section
            className={styles.cta}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={styles.ctaContent}>
              <h2>
                <span style={{ marginRight: "0.5rem" }}>🎯</span>
                Ready to start your inspiration journey?
              </h2>
              <p>
                <span style={{ marginRight: "0.5rem" }}>👥</span>
                Join thousands of creators who trust us with their most
                inspiring moments.
              </p>
              <Link href="/register" className="btn btn-primary">
                <span style={{ marginRight: "0.5rem" }}>🌟</span>
                Create Your Gallery
              </Link>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
