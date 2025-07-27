"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./auth.module.css";

export default function Login() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      router.push("/gallery");
    }
  }, [user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const result = await login(formData);

    if (result.success) {
      router.push("/gallery");
    }

    setIsLoading(false);
  };

  if (user) {
    return (
      <div className={styles.loading}>
        <div className="spinner"></div>
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className={styles.authPage}>
      <div className="container">
        <motion.div
          className={styles.authCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.authHeader}>
            <h1>
              <span style={{ marginRight: "0.5rem" }}>🔐</span>
              Welcome Back
            </h1>
            <p>
              <span style={{ marginRight: "0.5rem" }}>✨</span>
              Sign in to your inspiration gallery
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span style={{ marginRight: "0.5rem" }}>📧</span>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${
                  errors.email ? styles.inputError : ""
                }`}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {errors.email && (
                <span className={styles.errorMessage}>{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <span style={{ marginRight: "0.5rem" }}>🔒</span>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${
                  errors.password ? styles.inputError : ""
                }`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              {errors.password && (
                <span className={styles.errorMessage}>{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <span style={{ marginRight: "0.5rem" }}>🚀</span>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className={styles.authFooter}>
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/register" className={styles.authLink}>
                <span style={{ marginRight: "0.25rem" }}>📝</span>
                Create one here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
