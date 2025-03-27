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
      category,
      user: req?.user?._id
    });

    res.status(201).json({ message: "Book created successfully!", book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// get all books with pagination!!
router.get("/", authMiddleware, async (req, res) => {
  try {
    // apply pagination!
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;

    const totalCount = await BookModel.countDocuments({});

    const books = await BookModel.find()
      .sort({ createdAt: -1 })
      .populate("user", "username profileImage")
      .skip(startIndex)
      .limit(limit);

    res.json({
      message: "Books fetched successfully!",
      books,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// delete book!
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this book" });
    }

    await cloudinary.uploader.destroy(book.image);
    await book.remove();

    res.json({ message: "Book deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
