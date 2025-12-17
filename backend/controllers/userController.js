import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ========================== Register ==========================

export const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      securityQuestion,
      securityAnswer,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exist" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      securityQuestion,
      securityAnswer,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Validation Error:", err);

    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0].message;
      return res.status(400).json({ message: firstError });
    }

    if (err.code === 11000) {
      return res.status(400).json({ message: "User already exist" });
    }

    res.status(400).json({ message: "Server error" });
  }
};

// ========================== Login ==========================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", { email, password });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================== change password ==========================

export const changePassword = async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const dbAnswer = (user.securityAnswer || "").trim().toLowerCase();
    const userAnswer = (securityAnswer || "").trim().toLowerCase();

    if (dbAnswer !== userAnswer) {
      return res
        .status(400)
        .json({ message: "Incorrect answer to security question" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password", error });
  }
};
