import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Joi from "joi";

const Login = () => {
  // ======================= validation =============================

  const loginSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.email": "Please enter a valid email address.",
        "string.empty": "Email is required.",
      }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required.",
    }),
  });

  // ======================= submit =============================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    setError("");

    const { error: validationError } = loginSchema.validate(
      { email, password },
      { abortEarly: true }
    );

    if (validationError) {
      setError(validationError.details[0].message);
      return;
    }

    axios
      .post("http://localhost:3000/api/auth/login", {
        email,
        password,
      })
      .then((res) => {
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("password", password);
        navigate("/");
      })
      .catch((err) => {
        const msg =
          err.response?.data?.message || "Login failed. Please try again.";
        setError(msg);
      });
  };

  // ======================= eye icon =============================

  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordClick = () => setShowPassword((prev) => !prev);

  // ==============================================================

  return (
    <Box
      sx={{
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
          Login
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
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Email</Typography>
          <TextField
            fullWidth
            type="email"
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
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
          Sign In
        </Button>

        <Button
          onClick={() => navigate("/register")}
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
          Register
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
