import express from "express";

import "dotenv/config";
import jwt from "jsonwebtoken";
import { userModel } from "../models/User.js";

// create middleware!
export const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  console.log({token})

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get from data base!
    const user = await userModel.findById(decoded?.id);

    if (!user) {
      return res
        .status(403)
        .json({ message: "User not found, authorization denied" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: "Invalid token, authorization denied" });
  }
};
