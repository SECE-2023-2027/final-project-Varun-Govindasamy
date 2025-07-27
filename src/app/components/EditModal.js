"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import toast from "react-hot-toast";
import styles from "./EditModal.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function EditModal({ inspiration, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    title: inspiration?.title || "",
    description: inspiration?.description || "",
    tags: inspiration?.tags?.join(", ") || "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (inspiration) {
      setFormData({
        title: inspiration.title || "",
        description: inspiration.description || "",
        tags: inspiration.tags?.join(", ") || "",
      });
      setPreviewUrl(inspiration.imageUrl || "");
    }
  }, [inspiration]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setSelectedFile(file);
      setRemoveCurrentImage(false);

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
    setRemoveCurrentImage(true);
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

    setIsLoading(true);

    try {
      const submitFormData = new FormData();
      submitFormData.append("title", formData.title.trim());
      submitFormData.append("description", formData.description.trim());

      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      tags.forEach((tag) => {
        submitFormData.append("tags", tag);
      });

      if (selectedFile) {
        submitFormData.append("image", selectedFile);
      } else if (removeCurrentImage) {
        submitFormData.append("removeImage", "true");
      }

      const response = await fetch(
        `${API_URL}/api/inspirations/${inspiration._id}`,
        {
          method: "PUT",
          credentials: "include",
          body: submitFormData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Inspiration updated successfully!");
        onUpdate(data.inspiration);
        onClose();
      } else {
        toast.error(data.message || "Failed to update inspiration");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Network error during update");
    } finally {
      setIsLoading(false);
    }
  };

  if (!inspiration) return null;

  return (
    <motion.div
      className={styles.modal}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modalContent}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2>
            <span style={{ marginRight: "0.5rem" }}>✏️</span>
            Edit Inspiration
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.editForm}>
          <div className={styles.imageSection}>
            <label className="form-label">
              <span style={{ marginRight: "0.5rem" }}>🖼️</span>
              Image
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
                  <p>
                    {isDragActive
                      ? "Drop the image here"
                      : "Drag & drop an image or click to select"}
                  </p>
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
                    sizes="400px"
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
              className={`form-input ${errors.title ? styles.inputError : ""}`}
              disabled={isLoading}
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
              rows={3}
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              <span style={{ marginRight: "0.5rem" }}>❌</span>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Updating...
                </>
              ) : (
                <>
                  <span style={{ marginRight: "0.5rem" }}>💾</span>
                  Update Inspiration
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
