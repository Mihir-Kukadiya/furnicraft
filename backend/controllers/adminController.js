import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

// ================= Admin Login =================
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    res.json({
      message: "Admin login successful",
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Admin login failed" });
  }
};

// ================= Update Admin Profile =================
export const updateAdminProfile = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne();
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (email) admin.email = email;
    if (password) admin.password = password;

    await admin.save();

    res.json({ message: "Admin profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update admin profile" });
  }
};
