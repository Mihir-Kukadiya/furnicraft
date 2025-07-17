import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { FaCartShopping } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  // ==================== navigate to any page =======================

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Products", href: "#products" },
    { label: "Expensive", href: "#expensive" },
    { label: "About Us", href: "#about" },
    { label: "Contact Us", href: "#contact" },
    { label: "Login", href: "/login" },
  ];

  const navigate = useNavigate();

  const handleNavClick = (href) => {
    if (href.startsWith("/")) {
      navigate(href);
      return;
    }

    const id = href.replace("#", "");
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  };

  // ======================== admin login ===========================

  const [emailFocus, setEmailFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);

  const email = sessionStorage.getItem("email");
  const password = sessionStorage.getItem("password");

  const [loginError, setLoginError] = useState("");

  // ===================== open menu in avatar ========================

  const [anchorEl, setAnchorEl] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // ======================================================================

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Avatar
            sx={{ bgcolor: "#1976d2", width: 60, height: 60, fontSize: 28 }}
          >
            {email?.charAt(0)?.toUpperCase()}
          </Avatar>
        </Box>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          {sessionStorage.getItem("isAdmin") === "true"
            ? "Admin"
            : "My Account"}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" align="center" sx={{ mb: 1 }}>
            <strong>Email:</strong> {email}
          </Typography>
          <Typography variant="body1" align="center">
            <strong>Password:</strong>{" "}
            {password ? "*".repeat(password.length) : ""}
          </Typography>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAdminDialogOpen}
        onClose={() => setIsAdminDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -55%)",
            width: "500px",
            padding: "40px",
            backgroundColor: "rgba(0,0,0,0.9)",
            boxShadow: "0 15px 25px rgba(0,0,0,0.6)",
            borderRadius: "10px",
            boxSizing: "border-box",
            color: "#fff",
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: "30px",
            textAlign: "center",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}
        >
          Admin
        </Typography>

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column" }}
          onSubmit={(e) => e.preventDefault()}
        >
          <Box sx={{ position: "relative", mb: "30px" }}>
            <input
              required
              type="text"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              style={{
                width: "100%",
                padding: "10px 0",
                fontSize: "16px",
                color: "#fff",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid #fff",
                outline: "none",
              }}
            />
            <label
              style={{
                position: "absolute",
                left: "0",
                top: emailFocus || adminEmail ? "-10px" : "10px",
                fontSize: emailFocus || adminEmail ? "12px" : "16px",
                color: "#fff",
                transition: "0.3s ease",
                pointerEvents: "none",
              }}
            >
              Email
            </label>
          </Box>

          <Box sx={{ position: "relative", mb: "30px" }}>
            <input
              required
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onFocus={() => setPassFocus(true)}
              onBlur={() => setPassFocus(false)}
              style={{
                width: "100%",
                padding: "10px 0",
                fontSize: "16px",
                color: "#fff",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid #fff",
                outline: "none",
              }}
            />
            <label
              style={{
                position: "absolute",
                left: "0",
                top: passFocus || adminPassword ? "-10px" : "10px",
                fontSize: passFocus || adminPassword ? "12px" : "16px",
                color: "#fff",
                transition: "0.3s ease",
                pointerEvents: "none",
              }}
            >
              Password
            </label>
          </Box>
          {loginError && (
            <Typography
              variant="body2"
              sx={{ color: "#f44336", mb: 1, textAlign: "center" }}
            >
              {loginError}
            </Typography>
          )}

          <Box sx={{ textAlign: "center" }}>
            <Box
              component="a"
              onClick={() => {
                if (
                  adminEmail === "mkukadiya001@gmail.com" &&
                  adminPassword === "Mihir@4004"
                ) {
                  sessionStorage.setItem("email", adminEmail);
                  sessionStorage.setItem("password", adminPassword);
                  sessionStorage.setItem("isAdmin", "true");
                  setIsAdminDialogOpen(false);
                  setLoginError("");
                } else {
                  setLoginError("Invalid email or password");
                }
              }}
              sx={{
                position: "relative",
                display: "inline-block",
                width: "fit-content",
                float: "left",
                padding: "10px 20px",
                fontWeight: "bold",
                fontSize: "16px",
                color: "#fff",
                textDecoration: "none",
                textTransform: "uppercase",
                overflow: "hidden",
                letterSpacing: "3px",
                mt: "10px",
                cursor: "pointer",
                transition: ".5s",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#272727",
                  borderRadius: "5px",
                },
                "& span": {
                  position: "absolute",
                  display: "block",
                },
                "& span:nth-of-type(1)": {
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "2px",
                  background: "linear-gradient(90deg, transparent, #fff)",
                  animation: "btn-anim1 1.5s linear infinite",
                },
                "& span:nth-of-type(2)": {
                  top: "-100%",
                  right: 0,
                  width: "2px",
                  height: "100%",
                  background: "linear-gradient(180deg, transparent, #fff)",
                  animation: "btn-anim2 1.5s linear infinite",
                  animationDelay: ".375s",
                },
                "& span:nth-of-type(3)": {
                  bottom: 0,
                  right: "-100%",
                  width: "100%",
                  height: "2px",
                  background: "linear-gradient(270deg, transparent, #fff)",
                  animation: "btn-anim3 1.5s linear infinite",
                  animationDelay: ".75s",
                },
                "& span:nth-of-type(4)": {
                  bottom: "-100%",
                  left: 0,
                  width: "2px",
                  height: "100%",
                  background: "linear-gradient(360deg, transparent, #fff)",
                  animation: "btn-anim4 1.5s linear infinite",
                  animationDelay: "1.125s",
                },
                "@keyframes btn-anim1": {
                  "0%": { left: "-100%" },
                  "50%,100%": { left: "100%" },
                },
                "@keyframes btn-anim2": {
                  "0%": { top: "-100%" },
                  "50%,100%": { top: "100%" },
                },
                "@keyframes btn-anim3": {
                  "0%": { right: "-100%" },
                  "50%,100%": { right: "100%" },
                },
                "@keyframes btn-anim4": {
                  "0%": { bottom: "-100%" },
                  "50%,100%": { bottom: "100%" },
                },
              }}
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Submit
            </Box>
          </Box>
        </Box>
      </Dialog>

      <AppBar position="fixed" color="default" sx={{ boxShadow: 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            FurniCraft
          </Typography>

          <Box sx={{ display: "flex", gap: "15px" }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                onClick={() => handleNavClick(item.href)}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Tooltip title="Favorites">
              <IconButton
                component={Link}
                to="/favorites"
                sx={{
                  color: "inherit",
                  transition: "0.3s",
                  "&:hover": {
                    color: "#f44336",
                    transform: "scale(1.2)",
                  },
                }}
              >
                <FaHeart style={{ fontSize: "20px" }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Cart">
              <IconButton
                component={Link}
                to="/cart"
                sx={{
                  color: "inherit",
                  transition: "0.3s",
                  "&:hover": {
                    color: "#1976d2",
                    transform: "scale(1.2)",
                  },
                }}
              >
                <FaCartShopping style={{ fontSize: "20px" }} />
              </IconButton>
            </Tooltip>
            <IconButton
              size="small"
              onClick={handleMenu}
              color="inherit"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
            >
              <Avatar
                sx={{
                  height: "20px",
                  width: "20px",
                  color: "#000",
                  border: "none",
                  padding: email ? "20px" : "0",
                  backgroundColor: email ? "#1976D2" : "transparent",
                }}
              >
                {email ? email.charAt(0).toUpperCase() : <AccountCircle />}
              </Avatar>
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  setIsDialogOpen(true);
                }}
              >
                My account
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  setIsAdminDialogOpen(true);
                }}
              >
                Admin
              </MenuItem>

              {email ? (
                <MenuItem
                  onClick={() => {
                    handleCloseMenu();
                    sessionStorage.removeItem("email");
                    sessionStorage.removeItem("password");
                    sessionStorage.removeItem("isAdmin");
                    navigate("/login");
                  }}
                >
                  Log Out
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={() => {
                    handleCloseMenu();
                    navigate("/login");
                  }}
                >
                  Login
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
