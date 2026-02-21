import Auth from "../models/AuthModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const account = await Auth.findOne({ email });
    if (!account) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign(
      {
        id: account._id,
        role: account.role,
        email: account.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // ✅ LOG TOKEN BASED ON ROLE
    console.log(`🔐 ${account.role.toUpperCase()} JWT TOKEN:`, token);

    res.json({
      message: `${
        account.role === "admin" ? "Admin" : "User"
      } login successful`,
      token,
      user: {
        id: account._id,
        email: account.email,
        role: account.role,
        firstName: account.firstName || null,
        lastName: account.lastName || null,
        securityQuestion: account.securityQuestion || null,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

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

    const exists = await Auth.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Auth.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      securityQuestion,
      securityAnswer,
      role: "user",
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0].message;
      return res.status(400).json({ message: firstError });
    }

    res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;

    const user = await Auth.findOne({ email, role: "user" });
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
    res.status(500).json({ message: "Error changing password" });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { email, password } = req.body;

    const admin = await Auth.findOne({ _id: adminId, role: "admin" });
    if (!admin) {
      return res.status(403).json({ message: "Unauthorized admin" });
    }

    if (email) admin.email = email;
    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }

    await admin.save();

    res.json({ message: "Admin profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update admin profile" });
  }
};

// CREATE ADMIN (ONE TIME)
export const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await Auth.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Auth.create({
      email,
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json({
      message: "Admin created successfully",
      email: admin.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create admin" });
  }
};
