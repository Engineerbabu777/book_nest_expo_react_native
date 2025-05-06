import express from "express";
import cloudinary from "../config/cloudinary.js";
import { BookModel } from "../models/Book.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// create post!
router.post("/", authMiddleware, async function (req, res) {
  try {
    const { title, caption, image, category, rating } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (!category || !caption || !title || !rating) {
      return res
        .status(400)
        .json({ message: "Title, caption, and category are required" });
    }

    // upload image to cloudinary!
    // const uploadResponse = await cloudinary.uploader.upload(image, {
    //   folder: "book_images",
    // });

    const book = await BookModel.create({
      title,
      caption,
      image: 'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=',
      category,
      user: req?.user?._id,
      rating: Number(rating),
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
      totalPages: Math.ceil(totalCount / limit),
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
    await book.deleteOne();

    res.json({ message: "Book deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// books by current user!
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const books = await BookModel.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("user", "username profileImage");

    res.json({ message: "Books fetched successfully!", books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
