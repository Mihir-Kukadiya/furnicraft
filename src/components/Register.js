import React, { useState } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Joi from "joi";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const Register = () => {
  // ======================= validation =============================

  const registerSchema = Joi.object({
    firstName: Joi.string()
      .pattern(/^[A-Za-z]+$/)
      .required()
      .messages({
        "string.pattern.base": "First name must contain only letters.",
        "string.empty": "First name is required.",
      }),

    lastName: Joi.string()
      .pattern(/^[A-Za-z]+$/)
      .required()
      .messages({
        "string.pattern.base": "Last name must contain only letters.",
        "string.empty": "Last name is required.",
      }),

    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.email": "Please enter a valid email address.",
        "string.empty": "Email is required.",
      }),

    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters.",
      "string.empty": "Password is required.",
    }),

    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match.",
        "string.empty": "Confirm Password is required.",
      }),
  });

  // ======================= submit =============================

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    setError("");

    const { error: validationError } = registerSchema.validate(
      {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      },
      { abortEarly: true }
    );

    if (validationError) {
      setError(validationError.details[0].message);
      return;
    }

    axios
      .post("http://localhost:3000/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
      })
      .then(() => navigate("/login"))
      .catch((err) => {
        const msg = err.response?.data?.message;
        if (msg?.includes("Email already registered")) {
          setError("This email is already registered.");
        } else {
          setError("Registration failed. Please try again.");
        }
      });
  };

  // ======================= eye icon =============================

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordClick = () => setShowPassword((prev) => !prev);
  const handleConfirmPasswordClick = () =>
    setShowConfirmPassword((prev) => !prev);

  // ==============================================================

  return (
    <Box
      sx={{
        marginTop: "100px",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: 500,
          backgroundColor: "#fff",
          border: "2px solid #000",
          borderRadius: "10px",
          padding: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ textAlign: "center", fontWeight: 600 }}>
          Register
        </Typography>

        {error && (
          <Box
            sx={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "10px",
              borderRadius: "8px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            {error}
          </Box>
        )}

        <Box>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>First Name</Typography>
          <TextField
            fullWidth
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            InputProps={{
              sx: {
                borderRadius: "10px",
                height: "50px",
              },
            }}
          />
        </Box>

        <Box>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Last Name</Typography>
          <TextField
            fullWidth
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            InputProps={{
              sx: {
                borderRadius: "10px",
                height: "50px",
              },
            }}
          />
        </Box>

        <Box>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Email</Typography>
          <TextField
            fullWidth
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              sx: {
                borderRadius: "10px",
                height: "50px",
              },
            }}
          />
        </Box>

        <Box sx={{ position: "relative" }}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Password</Typography>
          <TextField
            type={showPassword ? "text" : "password"}
            fullWidth
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              sx: {
                borderRadius: "10px",
                height: "50px",
              },
            }}
          />
          <Box
            onClick={handlePasswordClick}
            sx={{
              position: "absolute",
              fontSize: "20px",
              right: "10px",
              top: "42px",
              cursor: "pointer",
              color: "#333",
            }}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </Box>
        </Box>

        <Box sx={{ position: "relative" }}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>
            Confirm Password
          </Typography>
          <TextField
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              sx: {
                borderRadius: "10px",
                height: "50px",
              },
            }}
          />
          <Box
            onClick={handleConfirmPasswordClick}
            sx={{
              position: "absolute",
              fontSize: "20px",
              right: "10px",
              top: "42px",
              cursor: "pointer",
              color: "#333",
            }}
          >
            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
          </Box>
        </Box>

        <Button
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#151717",
            color: "#fff",
            height: "50px",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 500,
            fontSize: "15px",
            mt: 1,
            "&:hover": {
              backgroundColor: "#000",
            },
          }}
          fullWidth
        >
          Sign Up
        </Button>

        <Button
          onClick={() => navigate("/login")}
          sx={{
            border: "1px solid #2d79f3",
            color: "#2d79f3",
            height: "50px",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 500,
            fontSize: "15px",
          }}
          fullWidth
        >
          Go back to Login
        </Button>
      </Box>
    </Box>
  );
};

export default Register;
