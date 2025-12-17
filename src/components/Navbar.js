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
  Avatar,
  Badge,
} from "@mui/material";
import { useCart } from "./CartProvider";
import { Snackbar, Alert } from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFavorites } from "./FavoritesProvider";
import Tooltip from "@mui/material/Tooltip";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { FaCartShopping } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";

const DEFAULT_ADMIN = {
  email: "mkukadiya001@gmail.com",
  password: "Mihir@3190",
};

if (!localStorage.getItem("adminCredentials")) {
  localStorage.setItem("adminCredentials", JSON.stringify(DEFAULT_ADMIN));
}

const Navbar = () => {
  // ========================= responsive ============================

  const isSmallScreen = useMediaQuery("(max-width: 900px)");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ==================== navigate to any page =======================

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

  // ======================= eye icon =============================

  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordClick = () => setShowPassword((prev) => !prev);

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

  // ===================== show number in cart ========================

  const { cartItems } = useCart();

  const totalQuantity = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  // ===================== show number in favorites ========================

  const { favorites } = useFavorites();

  // =========== error msg when click my account without login ==============

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // ============================ nav items ==================================

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Products", href: "#products" },
    { label: "Expensive", href: "#expensive" },
    { label: "About Us", href: "#about" },
    { label: "Contact Us", href: "#contact" },
    { label: "Favorites", href: "/favorites" },
    { label: "Cart", href: "/cart" },
    { label: "Admin", href: "#admin" },
    { label: "Login", href: "/login" },
  ];

  // ============================ admin change their profile ==================================

  const adminCredentials = JSON.parse(localStorage.getItem("adminCredentials"));

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState(
    adminCredentials?.email || ""
  );
  const [newAdminPassword, setNewAdminPassword] = useState("");

  // ==============================================================

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: 5,
            backgroundColor: "#f9f9f9",
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
          <Avatar
            sx={{
              bgcolor: "#fff",
              color: "#1976d2",
              width: 80,
              height: 80,
              fontSize: 32,
              mb: 2,
              mx: "auto",
            }}
          >
            {sessionStorage.getItem("isAdmin") === "true"
              ? "A"
              : email?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {sessionStorage.getItem("isAdmin") === "true"
              ? "Admin"
              : "My Account"}
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Email
            </Typography>
            <Typography
              variant="body1"
              sx={{
                p: 1,
                border: "1px solid #ddd",
                borderRadius: 1,
                backgroundColor: "#fff",
                wordBreak: "break-all",
              }}
            >
              {email}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Password
            </Typography>
            <Typography
              variant="body1"
              sx={{
                p: 1,
                border: "1px solid #ddd",
                borderRadius: 1,
                backgroundColor: "#fff",
                fontFamily: "monospace",
              }}
            >
              {password ? "*".repeat(password.length) : ""}
            </Typography>
          </Box>
          {sessionStorage.getItem("isAdmin") === "true" && (
            <Button
              variant="contained"
              fullWidth
              sx={{ mb: 2 }}
              onClick={() => {
                setNewAdminEmail(adminCredentials?.email || "");
                setNewAdminPassword(adminCredentials?.password || "");
                setIsDialogOpen(false);
                setIsEditProfileOpen(true);
              }}
            >
              Edit Profile
            </Button>
          )}

          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={() => {
              sessionStorage.removeItem("email");
              sessionStorage.removeItem("password");
              sessionStorage.removeItem("isAdmin");
              localStorage.removeItem("cartItems");
              localStorage.removeItem("favorites");
              setIsDialogOpen(false);
              navigate("/login");
              window.location.reload();
            }}
          >
            Logout
          </Button>
        </Box>
      </Dialog>

      <Dialog
        open={isAdminDialogOpen}
        onClose={() => setIsAdminDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        scroll="body"
        PaperProps={{
          sx: {
            width: {
              xs: "90%",
              md: "500px",
            },
            maxHeight: "95vh",
            overflowY: "auto",
            padding: {
              xs: "20px",
              md: "40px",
            },
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
              type={showPassword ? "text" : "password"}
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
            <Box
              onClick={handlePasswordClick}
              sx={{
                position: "absolute",
                right: "0",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#fff",
                fontSize: "18px",
              }}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </Box>
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
                  adminEmail === adminCredentials.email &&
                  adminPassword === adminCredentials.password
                ) {
                  sessionStorage.setItem("email", adminEmail);
                  sessionStorage.setItem("password", adminPassword);
                  sessionStorage.setItem("isAdmin", "true");
                  setIsAdminDialogOpen(false);
                  setLoginError("");
                  navigate("/");
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

      <Dialog
  open={isEditProfileOpen}
  onClose={() => setIsEditProfileOpen(false)}
  maxWidth="xs"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 3,
      overflow: "hidden",
      boxShadow: 5,
      backgroundColor: "#f9f9f9",
    },
  }}
>
  {/* ===== Header (Same as My Account) ===== */}
  <Box
    sx={{
      background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
      color: "#fff",
      p: 3,
      textAlign: "center",
    }}
  >
    <Avatar
      sx={{
        bgcolor: "#fff",
        color: "#1976d2",
        width: 80,
        height: 80,
        fontSize: 32,
        mb: 2,
        mx: "auto",
      }}
    >
      A
    </Avatar>

    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
      Edit Admin Profile
    </Typography>
  </Box>

  {/* ===== Body ===== */}
  <Box sx={{ p: 3 }}>
    {/* Email */}
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="textSecondary">
        Email
      </Typography>
      <input
        type="email"
        value={newAdminEmail}
        onChange={(e) => setNewAdminEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
    </Box>

    {/* Password */}
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" color="textSecondary">
        New Password
      </Typography>

      {/* hidden autofill breaker */}
      <input
        type="password"
        name="password"
        autoComplete="current-password"
        style={{ display: "none" }}
      />

      <input
        placeholder="Enter new password"
        value={newAdminPassword}
        autoComplete="new-password"
        name="new-password"
        onChange={(e) => setNewAdminPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
    </Box>

    {/* Buttons */}
    <Button
      variant="contained"
      fullWidth
      sx={{ mb: 1 }}
      onClick={() => {
        localStorage.setItem(
          "adminCredentials",
          JSON.stringify({
            email: newAdminEmail,
            password: newAdminPassword,
          })
        );

        setIsEditProfileOpen(false);
        window.location.reload();
      }}
    >
      Save Changes
    </Button>

    <Button
      variant="outlined"
      color="error"
      fullWidth
      onClick={() => setIsEditProfileOpen(false)}
    >
      Cancel
    </Button>
  </Box>
</Dialog>


      <AppBar position="fixed" color="default" sx={{ boxShadow: 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              cursor: "pointer",
              color: "#000",
              textDecoration: "none",
            }}
            component={"a"}
            href="/"
          >
            FurniCraft
          </Typography>

          {isSmallScreen ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                <Box
                  sx={{ width: 250 }}
                  role="presentation"
                  onClick={() => setDrawerOpen(false)}
                  onKeyDown={() => setDrawerOpen(false)}
                >
                  <List>
                    {navItems.map((item) => {
                      if (item.label === "Admin") {
                        if (email) return null;
                        return (
                          <ListItem
                            button
                            key="Admin"
                            onClick={() => setIsAdminDialogOpen(true)}
                          >
                            <ListItemText primary="Admin" />
                          </ListItem>
                        );
                      }

                      if (item.label === "Login") {
                        if (email) return null;
                        return (
                          <ListItem
                            button
                            key="Login"
                            onClick={() => navigate("/login")}
                          >
                            <ListItemText primary="Login" />
                          </ListItem>
                        );
                      }

                      return (
                        <ListItem
                          button
                          key={item.label}
                          onClick={() => handleNavClick(item.href)}
                        >
                          <ListItemText primary={item.label} />
                        </ListItem>
                      );
                    })}

                    {email && (
                      <ListItem
                        button
                        onClick={() => {
                          setDrawerOpen(false);
                          setIsDialogOpen(true);
                        }}
                      >
                        <ListItemText primary="My Account" />
                      </ListItem>
                    )}

                    {email && sessionStorage.getItem("isAdmin") === "true" && (
                      <ListItem
                        button
                        onClick={() => {
                          setDrawerOpen(false);
                          navigate("/orders");
                        }}
                      >
                        <ListItemText primary="Orders" />
                      </ListItem>
                    )}

                    {email && sessionStorage.getItem("isAdmin") !== "true" && (
                      <>
                        <ListItem
                          button
                          onClick={() => {
                            setDrawerOpen(false);
                            navigate("/address");
                          }}
                        >
                          <ListItemText primary="Address" />
                        </ListItem>
                      </>
                    )}

                    {email && sessionStorage.getItem("isAdmin") !== "true" && (
                      <ListItem
                        button
                        onClick={() => {
                          setDrawerOpen(false);
                          navigate("/my-orders");
                        }}
                      >
                        <ListItemText primary="My Orders" />
                      </ListItem>
                    )}

                    {email && (
                      <ListItem
                        button
                        onClick={() => {
                          sessionStorage.removeItem("email");
                          sessionStorage.removeItem("password");
                          sessionStorage.removeItem("isAdmin");
                          localStorage.removeItem("cartItems");
                          localStorage.removeItem("favorites");
                          setDrawerOpen(false);
                          navigate("/login");
                          window.location.reload();
                        }}
                      >
                        <ListItemText primary="Logout" />
                      </ListItem>
                    )}
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: "15px" }}>
              {navItems
                .filter(
                  (item) =>
                    item.label !== "Cart" &&
                    item.label !== "Admin" &&
                    item.label !== "Favorites" &&
                    !(item.label === "Login" && email)
                )
                .map((item) => (
                  <Button
                    key={item.label}
                    color="inherit"
                    onClick={() => handleNavClick(item.href)}
                  >
                    {item.label}
                  </Button>
                ))}
            </Box>
          )}

          {!isSmallScreen && (
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
                  <Badge
                    badgeContent={favorites.length}
                    color="error"
                    invisible={favorites.length === 0}
                  >
                    <FaHeart style={{ fontSize: "20px" }} />
                  </Badge>
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
                  <Badge
                    badgeContent={totalQuantity}
                    color="error"
                    invisible={totalQuantity === 0}
                  >
                    <FaCartShopping style={{ fontSize: "20px" }} />
                  </Badge>
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
                    border: "none",
                    padding: email ? "20px" : "0",
                    backgroundColor:
                      sessionStorage.getItem("isAdmin") === "true"
                        ? "#2f4bd7ff"
                        : email
                        ? "#1976D2"
                        : "transparent",
                    color:
                      sessionStorage.getItem("isAdmin") === "true"
                        ? "#000"
                        : "#000",
                    fontWeight:
                      sessionStorage.getItem("isAdmin") === "true"
                        ? "bold"
                        : "normal",
                    fontFamily:
                      sessionStorage.getItem("isAdmin") === "true"
                        ? "revert"
                        : "inherit",
                  }}
                >
                  {email ? (
                    sessionStorage.getItem("isAdmin") === "true" ? (
                      "A"
                    ) : (
                      email.charAt(0).toUpperCase()
                    )
                  ) : (
                    <AccountCircle />
                  )}
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
                    if (!email) {
                      setSnackbarMessage("Please log in to view your account");
                      setSnackbarSeverity("warning");
                      setOpenSnackbar(true);
                    } else {
                      setIsDialogOpen(true);
                    }
                  }}
                >
                  My account
                </MenuItem>

                {email && sessionStorage.getItem("isAdmin") === "true" && (
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      navigate("/orders");
                    }}
                  >
                    Orders
                  </MenuItem>
                )}

                {!email && (
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      setIsAdminDialogOpen(true);
                    }}
                  >
                    Admin
                  </MenuItem>
                )}
                {email && sessionStorage.getItem("isAdmin") !== "true" && (
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      navigate("/address");
                    }}
                  >
                    Address
                  </MenuItem>
                )}
                {email && sessionStorage.getItem("isAdmin") !== "true" && (
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      navigate("/my-orders");
                    }}
                  >
                    My Orders
                  </MenuItem>
                )}

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
          )}
        </Toolbar>
      </AppBar>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Navbar;
