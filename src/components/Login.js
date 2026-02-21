import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogContent,
  Alert,
  Snackbar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Joi from "joi";

const Login = () => {
  const theme = useTheme();
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

  // ======================= login =============================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    setError("");

    const { error: validationError } = loginSchema.validate(
      { email, password },
      { abortEarly: true },
    );

    if (validationError) {
      setError(validationError.details[0].message);
      setShowErrorPopup(true);
      return;
    }

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
        email,
        password,
      })
      .then((res) => {
        const { token, user } = res.data;

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("email", user.email);
        sessionStorage.setItem("role", user.role);

        if (user.role === "user") {
          sessionStorage.setItem("firstName", user.firstName);
          sessionStorage.setItem("lastName", user.lastName);
          sessionStorage.setItem("password", password);
          // Save security question to localStorage for change password dialog
          if (user.securityQuestion) {
            localStorage.setItem(`securityQuestion_${user.email}`, user.securityQuestion);
          }
        } else {
          sessionStorage.setItem("firstName", "Admin");
          sessionStorage.setItem("lastName", "");
          sessionStorage.setItem("password", password);
        }

        navigate("/");
      })
      .catch((err) => {
        const msg =
          err.response?.data?.message || "Login failed. Please try again.";
        setError(msg);
        setShowErrorPopup(true);
      });
  };

  // ======================= eye icon =============================

  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordClick = () => setShowPassword((prev) => !prev);

  // ======================= forgot password =============================

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  const handleForgotPassword = async () => {
    if (!forgotEmail || !securityAnswer || !newPassword) {
      setForgotMessage("Please fill all fields");
      setSeverity("warning");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/change-password`,
        {
          email: forgotEmail,
          securityAnswer,
          newPassword,
        },
      );

      setForgotMessage(res.data.message || "Password updated successfully");
      setSeverity("success");

      setTimeout(() => {
        setForgotOpen(false);
        setForgotEmail("");
        setSecurityAnswer("");
        setNewPassword("");
        setForgotMessage("");
      }, 2000);
    } catch (err) {
      setForgotMessage(
        err.response?.data?.message || "Failed to reset password",
      );
      setSeverity("error");
    }
  };

  // ======================= fetch security question from Register =============================

  const [securityQuestion, setSecurityQuestion] = useState("");

  const handleForgotEmailChange = (e) => {
    const emailInput = e.target.value;
    setForgotEmail(emailInput);

    const savedQuestion =
      localStorage.getItem(`securityQuestion_${emailInput}`) || "";
    setSecurityQuestion(savedQuestion);
  };

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
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
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
              color: theme.palette.text.secondary,
            }}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </Box>

          <Button
            onClick={() => setForgotOpen(true)}
            sx={{
              textTransform: "none",
              color: "#2d79f3",
              fontWeight: 500,
              fontSize: "15px",
              px: 0,
              ml: "auto",
              display: "block",
              "&:hover": {
                backgroundColor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            Forgot Password?
          </Button>
        </Box>

        <Button
          onClick={handleSubmit}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            height: "50px",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 500,
            fontSize: "15px",

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
            border: `1px solid ${theme.palette.primary.main}`,
            color: theme.palette.primary.main,
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

      <Dialog
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: 5,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
            color: "#fff",
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h5">Change Password</Typography>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            {forgotMessage && (
              <Alert severity={severity}>{forgotMessage}</Alert>
            )}

            <TextField
              label="Registered Email"
              type="email"
              value={forgotEmail}
              onChange={handleForgotEmailChange}
              fullWidth
            />

            <TextField
              label="Security Question"
              value={securityQuestion}
              disabled
              fullWidth
              sx={{
                backgroundColor: theme.palette.action.disabledBackground,
              }}
            />

            <TextField
              label="Security Answer"
              placeholder="Enter your security answer"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              fullWidth
            />

            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleForgotPassword}
              fullWidth
            >
              Reset Password
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() => setForgotOpen(false)}
              fullWidth
            >
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Login;
