import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    match: [/^[A-Za-z\s]+$/, "First name must contain only letters and spaces"],
  },
  lastName: {
    type: String,
    required: true,
    match: [/^[A-Za-z\s]+$/, "Last name must contain only letters and spaces"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: { type: String, required: true },
  securityQuestion: {
    type: String,
    required: true,
    enum: {
      values: ["favoriteColor", "favoriteGame"],
      message: "Please select valid Security question",
    },
  },
  securityAnswer: { type: String, required: true },
});

export default mongoose.model("User", userSchema);
