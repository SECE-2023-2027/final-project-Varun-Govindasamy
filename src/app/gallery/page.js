"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import EditModal from "../components/EditModal";
import styles from "./gallery.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Gallery() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [inspirations, setInspirations] = useState([]);
  const [filteredInspirations, setFilteredInspirations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedInspiration, setSelectedInspiration] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchInspirations();
    }
  }, [user]);

  useEffect(() => {
    // Filter inspirations when dependencies change
    let filtered = inspirations;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((item) =>
        selectedTags.every((tag) => item.tags.includes(tag))
      );
    }

    setFilteredInspirations(filtered);
  }, [inspirations, searchTerm, selectedTags]);

  const fetchInspirations = async () => {
    try {
      const response = await fetch(`${API_URL}/api/inspirations`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setInspirations(data);

        // Extract all unique tags
        const tags = [...new Set(data.flatMap((item) => item.tags))];
        setAllTags(tags);
      } else {
        toast.error("Failed to fetch inspirations");
      }
    } catch (error) {
      console.error("Error fetching inspirations:", error);
      toast.error("Network error while fetching inspirations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inspiration?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/inspirations/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setInspirations((prev) => prev.filter((item) => item._id !== id));
        setSelectedInspiration(null);
        toast.success("Inspiration deleted successfully");
      } else {
        toast.error("Failed to delete inspiration");
      }
    } catch (error) {
      console.error("Error deleting inspiration:", error);
      toast.error("Network error while deleting");
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
    <div className={styles.galleryPage}>
      <div className="container">
        <motion.div
          className={styles.galleryHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.headerContent}>
            <h1>
              <span style={{ marginRight: "0.5rem" }}>🖼️</span>
              My Inspiration Gallery
            </h1>
            <p>
              <span style={{ marginRight: "0.5rem" }}>✨</span>
              Your personal collection of inspiring moments
            </p>
          </div>
          <Link href="/upload" className="btn btn-primary">
            <span style={{ marginRight: "0.5rem" }}>📤</span>
            Add New Inspiration
          </Link>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          className={styles.filtersSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="🔍 Search inspirations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>

          {allTags.length > 0 && (
            <div className={styles.tagsFilter}>
              <h3>Filter by tags:</h3>
              <div className={styles.tagsList}>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`${styles.tagBtn} ${
                      selectedTags.includes(tag) ? styles.tagActive : ""
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {(searchTerm || selectedTags.length > 0) && (
                <button onClick={clearFilters} className="btn btn-secondary">
                  <span style={{ marginRight: "0.5rem" }}>🗑️</span>
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          className={styles.galleryGrid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isLoading ? (
            <div className={styles.loadingGrid}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className={styles.skeletonCard}>
                  <div className={styles.skeletonImage}></div>
                  <div className={styles.skeletonContent}>
                    <div className={styles.skeletonTitle}></div>
                    <div className={styles.skeletonText}></div>
                    <div className={styles.skeletonTags}>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredInspirations.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📸</div>
              <h3>
                {inspirations.length === 0
                  ? "No inspirations yet"
                  : "No matches found"}
              </h3>
              <p>
                {inspirations.length === 0
                  ? "Start building your gallery by adding your first inspiration"
                  : "Try adjusting your search or filter criteria"}
              </p>
              {inspirations.length === 0 && (
                <Link href="/upload" className="btn btn-primary">
                  Add Your First Inspiration
                </Link>
              )}
            </div>
          ) : (
            <AnimatePresence>
              {filteredInspirations.map((inspiration, index) => (
                <motion.div
                  key={inspiration._id}
                  className={styles.inspirationCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedInspiration(inspiration)}
                >
                  {inspiration.imageUrl && (
                    <div className={styles.cardImage}>
                      <Image
                        src={inspiration.imageUrl}
                        alt={inspiration.title}
                        fill
                        style={{ objectFit: "contain" }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}

                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{inspiration.title}</h3>
                    {inspiration.description && (
                      <p className={styles.cardDescription}>
                        {inspiration.description.length > 100
                          ? `${inspiration.description.substring(0, 100)}...`
                          : inspiration.description}
                      </p>
                    )}

                    {inspiration.tags.length > 0 && (
                      <div className={styles.cardTags}>
                        {inspiration.tags.map((tag) => (
                          <span key={tag} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className={styles.cardFooter}>
                      <span className={styles.cardDate}>
                        {new Date(inspiration.createdAt).toLocaleDateString()}
                      </span>
                      <div className={styles.cardActions}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInspiration(inspiration);
                            setIsEditing(true);
                          }}
                          className={styles.editBtn}
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(inspiration._id);
                          }}
                          className={styles.deleteBtn}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Modal for viewing/editing inspiration */}
        <AnimatePresence>
          {selectedInspiration && (
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedInspiration(null);
                setIsEditing(false);
              }}
            >
              <motion.div
                className={styles.modalContent}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={styles.closeBtn}
                  onClick={() => {
                    setSelectedInspiration(null);
                    setIsEditing(false);
                  }}
                >
                  ×
                </button>

                {selectedInspiration.imageUrl && (
                  <div className={styles.modalImage}>
                    <Image
                      src={selectedInspiration.imageUrl}
                      alt={selectedInspiration.title}
                      fill
                      style={{ objectFit: "contain" }}
                      sizes="(max-width: 768px) 100vw, 80vw"
                    />
                  </div>
                )}

                <div className={styles.modalInfo}>
                  <h2>{selectedInspiration.title}</h2>
                  {selectedInspiration.description && (
                    <p>{selectedInspiration.description}</p>
                  )}

                  {selectedInspiration.tags.length > 0 && (
                    <div className={styles.modalTags}>
                      {selectedInspiration.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className={styles.modalFooter}>
                    <span className={styles.modalDate}>
                      Created:{" "}
                      {new Date(
                        selectedInspiration.createdAt
                      ).toLocaleDateString()}
                    </span>
                    <div className={styles.modalActions}>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-secondary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(selectedInspiration._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        {isEditing && selectedInspiration && (
          <EditModal
            inspiration={selectedInspiration}
            onClose={() => {
              setIsEditing(false);
              setSelectedInspiration(null);
            }}
            onUpdate={(updatedInspiration) => {
              setInspirations(
                inspirations.map((item) =>
                  item._id === updatedInspiration._id
                    ? updatedInspiration
                    : item
                )
              );
              setSelectedInspiration(updatedInspiration);
              setIsEditing(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
