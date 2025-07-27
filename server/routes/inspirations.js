const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Inspiration = require("../models/Inspiration");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Check if Cloudinary is configured
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (!isCloudinaryConfigured) {
  console.warn(
    "⚠️  Cloudinary not configured. Image uploads will be disabled."
  );
  console.log("📝 To enable image uploads:");
  console.log("   1. Sign up at https://cloudinary.com/");
  console.log("   2. Get your credentials from the dashboard");
  console.log("   3. Update the .env file with your credentials");
}

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Get all inspirations for logged-in user
router.get("/inspirations", authMiddleware, async (req, res) => {
  try {
    const { search, tags } = req.query;
    let query = { userId: req.user._id };

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Add tag filtering
    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      query.tags = { $in: tagArray };
    }

    const inspirations = await Inspiration.find(query).sort({ createdAt: -1 });

    res.json(inspirations);
  } catch (error) {
    console.error("Error fetching inspirations:", error);
    res.status(500).json({ message: "Error fetching inspirations" });
  }
});

// Create new inspiration
router.post(
  "/inspirations",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description, tags } = req.body;
      let imageUrl = "";

      // Validation
      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }

      // Upload image to Cloudinary if provided and configured
      if (req.file) {
        if (!isCloudinaryConfigured) {
          console.warn("Image upload attempted but Cloudinary not configured");
          console.log("💡 Creating inspiration without image...");
          // Continue without image instead of returning error
        } else {
          try {
            const result = await new Promise((resolve, reject) => {
              cloudinary.uploader
                .upload_stream(
                  {
                    resource_type: "auto",
                    folder: "inspiration_gallery",
                  },
                  (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                  }
                )
                .end(req.file.buffer);
            });

            imageUrl = result.secure_url;
            console.log("✅ Image uploaded successfully:", imageUrl);
          } catch (cloudinaryError) {
            console.error("Cloudinary upload error:", cloudinaryError);
            console.log(
              "💡 Creating inspiration without image due to upload error..."
            );
            // Continue without image instead of returning error
          }
        }
      }

      // Parse tags
      let tagArray = [];
      if (tags) {
        if (typeof tags === "string") {
          tagArray = tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag);
        } else if (Array.isArray(tags)) {
          tagArray = tags.map((tag) => tag.trim()).filter((tag) => tag);
        }
      }

      const inspiration = new Inspiration({
        userId: req.user._id,
        title,
        description: description || "",
        imageUrl,
        tags: tagArray,
      });

      await inspiration.save();

      res.status(201).json({
        message: "Inspiration created successfully",
        inspiration,
      });
    } catch (error) {
      console.error("Error creating inspiration:", error);
      res.status(500).json({ message: "Error creating inspiration" });
    }
  }
);

// Update inspiration
router.put(
  "/inspirations/:id",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, tags, removeImage } = req.body;

      const inspiration = await Inspiration.findOne({
        _id: id,
        userId: req.user._id,
      });
      if (!inspiration) {
        return res.status(404).json({ message: "Inspiration not found" });
      }

      // Update fields
      if (title) inspiration.title = title;
      if (description !== undefined) inspiration.description = description;

      // Handle image update
      if (removeImage === "true") {
        inspiration.imageUrl = "";
      } else if (req.file) {
        if (!isCloudinaryConfigured) {
          console.warn("Image update attempted but Cloudinary not configured");
          console.log("💡 Updating inspiration without changing image...");
          // Continue without updating image
        } else {
          try {
            const result = await new Promise((resolve, reject) => {
              cloudinary.uploader
                .upload_stream(
                  {
                    resource_type: "auto",
                    folder: "inspiration_gallery",
                  },
                  (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                  }
                )
                .end(req.file.buffer);
            });

            inspiration.imageUrl = result.secure_url;
            console.log("✅ Image updated successfully:", inspiration.imageUrl);
          } catch (cloudinaryError) {
            console.error("Cloudinary upload error:", cloudinaryError);
            console.log(
              "💡 Updating inspiration without changing image due to upload error..."
            );
            // Continue without updating image
          }
        }
      }

      // Parse and update tags
      if (tags !== undefined) {
        let tagArray = [];
        if (tags) {
          if (typeof tags === "string") {
            tagArray = tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag);
          } else if (Array.isArray(tags)) {
            tagArray = tags.map((tag) => tag.trim()).filter((tag) => tag);
          }
        }
        inspiration.tags = tagArray;
      }

      await inspiration.save();

      res.json({
        message: "Inspiration updated successfully",
        inspiration,
      });
    } catch (error) {
      console.error("Error updating inspiration:", error);
      res.status(500).json({ message: "Error updating inspiration" });
    }
  }
);

// Delete inspiration
router.delete("/inspirations/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const inspiration = await Inspiration.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });
    if (!inspiration) {
      return res.status(404).json({ message: "Inspiration not found" });
    }

    res.json({ message: "Inspiration deleted successfully" });
  } catch (error) {
    console.error("Error deleting inspiration:", error);
    res.status(500).json({ message: "Error deleting inspiration" });
  }
});

module.exports = router;
