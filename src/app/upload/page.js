"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import Image from "next/image";
import styles from "./upload.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Upload() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
  });

  const handleInputChange = (e) => {
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

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);

    try {
      const submitFormData = new FormData();
      submitFormData.append("title", formData.title.trim());
      submitFormData.append("description", formData.description.trim());

      // Process tags
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      tags.forEach((tag) => {
        submitFormData.append("tags", tag);
      });

      if (selectedFile) {
        submitFormData.append("image", selectedFile);
      }

      const response = await fetch(`${API_URL}/api/inspirations`, {
        method: "POST",
        credentials: "include",
        body: submitFormData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Inspiration added successfully!");
        router.push("/gallery");
      } else {
        toast.error(data.message || "Failed to add inspiration");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Network error during upload");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading || (!user && !loading)) {
    return (
      <div className={styles.loading}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.uploadPage}>
      <div className="container">
        <motion.div
          className={styles.uploadContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.uploadHeader}>
            <h1>
              <span style={{ marginRight: "0.5rem" }}>📤</span>
              Add New Inspiration
            </h1>
            <p>
              <span style={{ marginRight: "0.5rem" }}>✨</span>
              Share something that inspires you with your future self
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.uploadForm}>
            {/* Image Upload Section */}
            <div className={styles.imageUploadSection}>
              <label className="form-label">
                <span style={{ marginRight: "0.5rem" }}>🖼️</span>
                Image (Optional)
              </label>

              {!previewUrl ? (
                <div
                  {...getRootProps()}
                  className={`${styles.dropzone} ${
                    isDragActive ? styles.dropzoneActive : ""
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className={styles.dropzoneContent}>
                    <div className={styles.dropzoneIcon}>📸</div>
                    <h3>
                      {isDragActive
                        ? "Drop the image here"
                        : "Drag & drop an image here"}
                    </h3>
                    <p>or click to select a file</p>
                    <span className={styles.dropzoneHint}>
                      Supports: JPEG, PNG, GIF, WebP (max 10MB)
                    </span>
                  </div>
                </div>
              ) : (
                <div className={styles.imagePreview}>
                  <div className={styles.previewContainer}>
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      style={{ objectFit: "contain" }}
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className={styles.removeImageBtn}
                  >
                    <span style={{ marginRight: "0.5rem" }}>🗑️</span>
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className={styles.formFields}>
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  <span style={{ marginRight: "0.5rem" }}>📝</span>
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`form-input ${
                    errors.title ? styles.inputError : ""
                  }`}
                  placeholder="What inspires you about this?"
                  disabled={isUploading}
                />
                {errors.title && (
                  <span className={styles.errorMessage}>{errors.title}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  <span style={{ marginRight: "0.5rem" }}>💭</span>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Tell your future self why this inspired you..."
                  rows={4}
                  disabled={isUploading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="tags" className="form-label">
                  <span style={{ marginRight: "0.5rem" }}>🏷️</span>
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="art, motivation, quotes (comma-separated)"
                  disabled={isUploading}
                />
                <span className={styles.fieldHint}>
                  Separate multiple tags with commas
                </span>
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => router.push("/gallery")}
                className="btn btn-secondary"
                disabled={isUploading}
              >
                <span style={{ marginRight: "0.5rem" }}>❌</span>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="spinner"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <span style={{ marginRight: "0.5rem" }}>✨</span>
                    Add Inspiration
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
