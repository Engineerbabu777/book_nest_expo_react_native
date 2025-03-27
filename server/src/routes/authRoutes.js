import express from "express";
import { userModel } from "../models/User.js";
import bcryptjs from "bcryptjs";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // check password length error!
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Username should be at least 3 character long!" });
    }

    // check if user already exists!
    const isExists = await userModel.findOne({
      $or: [{ email }, { username }]
    });

    if (isExists) {
      return res
        .status(400)
        .json({ message: "User already exists with this email or username!" });
    }

    const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;

    // has password!
    const hashedPassword = await bcryptjs.hash(password, 10);

    // create and save user to db!
    const user = await userModel.create({
      email,
      username,
      password: hashedPassword,
      profileImage
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  res.send("login");
});

export default router; //export the router
