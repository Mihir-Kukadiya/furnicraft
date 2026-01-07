import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: function () {
        return this.role === "user";
      },
      match: [
        /^[A-Za-z\s]+$/,
        "First name must contain only letters and spaces",
      ],
    },

    lastName: {
      type: String,
      required: function () {
        return this.role === "user";
      },
      match: [
        /^[A-Za-z\s]+$/,
        "Last name must contain only letters and spaces",
      ],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: true,
    },

    securityQuestion: {
      type: String,
      required: function () {
        return this.role === "user";
      },
      enum: {
        values: ["favoriteColor", "favoriteGame"],
        message: "Please select valid Security question",
      },
    },

    securityAnswer: {
      type: String,
      required: function () {
        return this.role === "user";
      },
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Auth", authSchema);
