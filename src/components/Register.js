import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Joi from "joi";
import { useTheme } from "@mui/material/styles";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const Register = () => {
  const theme = useTheme();
  // ======================= validation =============================

  const registerSchema = Joi.object({
    firstName: Joi.string()
      .pattern(/^[A-Za-z\s]+$/)
      .required()
      .messages({
        "string.pattern.base": "First name must contain only letters.",
        "string.empty": "First name is required.",
      }),

    lastName: Joi.string()
      .pattern(/^[A-Za-z\s]+$/)
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

    securityQuestion: Joi.string().required().messages({
      "string.empty": "Please select a security question.",
    }),

    securityAnswer: Joi.string().required().messages({
      "string.empty": "Answer is required.",
    }),
  });

  // ======================= input fields =============================

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // =================== Auto scroll to top when error appears ===================

  useEffect(() => {
    if (error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error]);

  // ========================= submit form ============================

  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleSubmit = () => {
    setError("");

    const { error: validationError } = registerSchema.validate(
      {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        securityQuestion,
        securityAnswer: answer,
      },
      { abortEarly: true }
    );

    if (validationError) {
      setError(validationError.details[0].message);
      setShowErrorPopup(true);

      return;
    }

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
        firstName,
        lastName,
        email,
        password,
        securityQuestion,
        securityAnswer: answer,
      })
      .then(() => {
        localStorage.setItem(`securityQuestion_${email}`, securityQuestion);
        localStorage.setItem(`securityAnswer_${email}`, answer);

        sessionStorage.clear();

        sessionStorage.setItem("firstName", firstName);
        sessionStorage.setItem("lastName", lastName);

        navigate("/login");
      })
      .catch((err) => {
        const msg =
          err.response?.data?.message ||
          "Registration failed. Please try again.";
        setError(msg);
        setShowErrorPopup(true);
      });
  };

  // ======================= eye icons =============================

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordClick = () => setShowPassword((prev) => !prev);
  const handleConfirmPasswordClick = () =>
    setShowConfirmPassword((prev) => !prev);

  // ==============================================================

  return (
    <>
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
            backgroundColor: "background.paper",
            border: `1px solid ${theme.palette.divider}`,
            color: "text.primary",
            borderRadius: "10px",
            padding: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{ textAlign: "center", fontWeight: 600 }}
          >
            Register
          </Typography>

          <Snackbar
            open={showErrorPopup}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            onClose={() => setShowErrorPopup(false)}
          >
            <Alert
              onClose={() => setShowErrorPopup(false)}
              severity="error"
              sx={{ width: "100%" }}
            >
              {error}
            </Alert>
          </Snackbar>

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
                  backgroundColor: "background.paper",
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
                  backgroundColor: "background.paper",
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
                  backgroundColor: "background.paper",
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
                  backgroundColor: "background.paper",
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
                color: "text.secondary",
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
                  backgroundColor: "background.paper",
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
                color: "text.secondary",
              }}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>
              Security Question
            </Typography>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="security-question-label">
                Select Security Question
              </InputLabel>
              <Select
                labelId="security-question-label"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                label="Select Security Question"
                sx={{
                  borderRadius: "10px",
                  height: "50px",
                  backgroundColor: "background.paper",
                }}
              >
                <MenuItem value="favoriteColor">
                  What is your favorite color?
                </MenuItem>
                <MenuItem value="favoriteGame">
                  What is your favorite game?
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>
              Answer (For Security Question)
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: "10px",
                  height: "50px",
                  backgroundColor: "background.paper",
                },
              }}
            />
          </Box>

          <Button
            onClick={handleSubmit}
            sx={{
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
              height: "50px",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "15px",
              mt: 1,
              "&:hover": { backgroundColor: "#000" },
            }}
            fullWidth
          >
            Sign Up
          </Button>

          <Button
            onClick={() => navigate("/login")}
            sx={{
              border: `1px solid ${theme.palette.primary.main}`,
              color: "primary.main",
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
    </>
  );
};

export default Register;
