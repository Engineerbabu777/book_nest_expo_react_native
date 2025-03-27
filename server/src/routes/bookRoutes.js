import express from "express";
import cloudinary from "../config/cloudinary.js";
import { BookModel } from "../models/Book.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// create post!
router.post("/", authMiddleware, async function (req, res) {
  try {
    const { title, caption, image, category } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (!category || !caption || !title) {
      return res
        .status(400)
        .json({ message: "Title, caption, and category are required" });
    }

    // upload image to cloudinary!
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "book_images"
    });

    const book = await BookModel.create({
      title,
      caption,
      image: uploadResponse.secure_url,
      category
      //   user: req?.user?._id
    });

    res.status(201).json({ message: "Book created successfully!", book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
