import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    rating: {
      type: Number,
      default: 1,
      min: 1,
      max: 5
    }
  },
  {
    timestamps: true
  }
);

export const BookModel = mongoose.model("Book", bookSchema);
