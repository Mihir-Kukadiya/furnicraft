import React, { useState, useEffect, useCallback } from "react";
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
  TextField,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { useCart } from "../components/CartProvider";
import axiosInstance from "../utils/axiosInstance";
import { Snackbar, Alert } from "@mui/material";
import { useFavorites } from "../components/FavoritesProvider";
import Tooltip from "@mui/material/Tooltip";
import { FaCartShopping } from "react-icons/fa6";
import { useTheme } from "@mui/material/styles";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import Drawer from "@mui/material/Drawer";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useThemeMode } from "../theme/ThemeContext";

const Navbar = () => {
  // ========================= theme ============================
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();

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

  const email = sessionStorage.getItem("email");
  const role = sessionStorage.getItem("role");
  const password = sessionStorage.getItem("password");

  // ===================== open menu in avatar ========================

  const [anchorEl, setAnchorEl] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState(email || "");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  // ===================== Change Password (user) ========================

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");

  React.useEffect(() => {
    if (email && sessionStorage.getItem("role") !== "admin") {
      const savedQuestion =
        localStorage.getItem(`securityQuestion_${email}`) || "";
      setSecurityQuestion(savedQuestion);
    }
  }, [email]);

  // ===================== Notifications ========================

  const [notifications, setNotifications] = useState([]);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!email || role === "admin") return;

    try {
      const res = await axiosInstance.get("/auth/notifications");
      setNotifications(res.data.notifications || []);
      const unread = (res.data.notifications || []).filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [email, role]);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
    fetchNotifications();
  };

  const handleCloseNotification = () => {
    setNotificationAnchor(null);
  };

  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.put(`/auth/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n =>
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.put("/auth/notifications/read-all");
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const formatNotificationDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

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
            bgcolor: "background.paper",
            color: "text.primary",
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
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.background.paper,
                color: theme.palette.primary.main,
                fontSize: "32px",
                mb: "16px",
                height: "80px",
                width: "80px",
              }}
            >
              {role === "admin" ? "A" : email?.charAt(0)?.toUpperCase()}
            </Avatar>
          </Box>

          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {role === "admin" ? "Admin Account" : "My Account"}
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography
              variant="body1"
              sx={{
                p: 1,
                backgroundColor: "background.paper",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                wordBreak: "break-all",
              }}
            >
              {email}
            </Typography>
          </Box>

          {password && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Password
              </Typography>
              <input
                type="password"
                value={password}
                readOnly
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                }}
              />
            </Box>
          )}

          {sessionStorage.getItem("role") === "admin" && (
            <Button
              variant="contained"
              fullWidth
              sx={{ mb: 2 }}
              onClick={() => {
                setNewAdminEmail(email || "");
                setNewAdminPassword(password || "");

                setIsDialogOpen(false);
                setIsEditProfileOpen(true);
              }}
            >
              Edit Profile
            </Button>
          )}
          {sessionStorage.getItem("role") !== "admin" && (
            <Button
              variant="contained"
              fullWidth
              sx={{ mb: 2 }}
              onClick={() => {
                setIsDialogOpen(false);
                setIsChangePasswordOpen(true);
              }}
            >
              Change Password
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
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        maxWidth="xs"
        fullWidth
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

        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Email" value={email} disabled fullWidth />

          <TextField
            label="Security Question"
            value={securityQuestion}
            disabled
            fullWidth
            sx={{
              input: { color: "text.primary" },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.divider,
              },
            }}
          />

          <TextField
            label="Security Answer"
            placeholder="Enter your answer"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            fullWidth
            sx={{
              input: { color: "text.primary" },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.divider,
              },
            }}
          />

          <TextField
            label="New Password"
            type="password"
            value={newUserPassword}
            onChange={(e) => setNewUserPassword(e.target.value)}
            fullWidth
            sx={{
              input: { color: "text.primary" },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.divider,
              },
            }}
          />

          <Button
            variant="contained"
            onClick={async () => {
              if (!securityAnswer || !newUserPassword) {
                setSnackbarMessage("Please fill all fields");
                setSnackbarSeverity("warning");
                setOpenSnackbar(true);
                return;
              }

              try {
                const res = await axiosInstance.post(
                  "/auth/change-password",
                  {
                    email,
                    securityAnswer,
                    newPassword: newUserPassword,
                  }
                );

                setSnackbarMessage(
                  res.data.message || "Password changed successfully"
                );
                setSnackbarSeverity("success");
                setOpenSnackbar(true);

                setIsChangePasswordOpen(false);
                setSecurityAnswer("");
                setNewUserPassword("");
              } catch (err) {
                setSnackbarMessage(
                  err.response?.data?.message || "Invalid security answer"
                );
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
              }
            }}
          >
            Save Password
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={() => setIsChangePasswordOpen(false)}
          >
            Cancel
          </Button>
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
            bgcolor: "background.paper",
            color: "text.primary",
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
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.background.paper,
                color: theme.palette.primary.main,
                fontSize: "32px",
                mb: "16px",
                width: "80px",
              }}
            >
              {sessionStorage.getItem("role") === "admin"
                ? "A"
                : email?.charAt(0)?.toUpperCase()}
            </Avatar>
          </Box>

          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Edit Admin Profile
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
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
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Password
            </Typography>

            <input
              type="password"
              placeholder="Enter password"
              value={newAdminPassword}
              autoComplete="off"
              name={`admin-password-${Date.now()}`}
              onChange={(e) => setNewAdminPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }}
            />
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{ mb: 1 }}
            onClick={async () => {
              try {
                await axiosInstance.put("/auth/admin/update", {
                  email: newAdminEmail,
                  password: newAdminPassword,
                });

                setSnackbarMessage("Admin profile updated successfully");
                setSnackbarSeverity("success");
                setOpenSnackbar(true);

                sessionStorage.setItem("email", newAdminEmail);
                sessionStorage.setItem("password", newAdminPassword);

                setIsEditProfileOpen(false);
              } catch (err) {
                setSnackbarMessage(
                  err.response?.data?.message ||
                  "Failed to update admin profile"
                );
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
              }
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
              color: "text.primary",
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
                    {navItems
                      .filter((item) => item.label !== "Admin")
                      .map((item) => {
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

                    {email && sessionStorage.getItem("role") === "admin" && (
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

                    {email && role === "user" && (
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

                    {email && sessionStorage.getItem("role") !== "admin" && (
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
                          sessionStorage.clear();
                          localStorage.removeItem("cartItems");
                          localStorage.removeItem("favorites");
                          navigate("/login");
                          window.location.reload();
                          setDrawerOpen(false);
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

              {/* Notification Icon - Only for non-admin users */}
              {email && role !== "admin" && (
                <Tooltip title="Notifications">
                  <IconButton
                    onClick={handleNotificationClick}
                    sx={{
                      color: "inherit",
                      transition: "0.3s",
                      "&:hover": {
                        color: "#ff9800",
                        transform: "scale(1.2)",
                      },
                    }}
                  >
                    <Badge
                      badgeContent={unreadCount}
                      color="error"
                      invisible={unreadCount === 0}
                    >
                      <NotificationsIcon style={{ fontSize: "22px" }} />
                    </Badge>
                  </IconButton>
                </Tooltip>
              )}

              {/* Notification Popover */}
              <Popover
                open={Boolean(notificationAnchor)}
                anchorEl={notificationAnchor}
                onClose={handleCloseNotification}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{
                  sx: {
                    width: 320,
                    maxHeight: 400,
                    mt: 1,
                  },
                }}
              >
                <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6" fontWeight="bold">
                    Notifications
                  </Typography>
                  {unreadCount > 0 && (
                    <Button size="small" onClick={markAllAsRead}>
                      Mark all read
                    </Button>
                  )}
                </Box>
                <Divider />
                {notifications.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: "center" }}>
                    <Typography color="text.secondary">
                      No notifications yet
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ maxHeight: 300, overflow: "auto" }}>
                    {notifications.slice(0, 10).map((notification) => (
                      <ListItem
                        key={notification._id}
                        onClick={() => markAsRead(notification._id)}
                        sx={{
                          bgcolor: notification.isRead ? "transparent" : "action.hover",
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: "action.selected",
                          },
                        }}
                      >
                        <ListItemIcon>
                          <CheckCircleIcon
                            color={notification.isRead ? "disabled" : "success"}
                            fontSize="small"
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={notification.message}
                          secondary={formatNotificationDate(notification.createdAt)}
                          primaryTypographyProps={{
                            fontSize: "14px",
                            fontWeight: notification.isRead ? "normal" : "bold",
                          }}
                          secondaryTypographyProps={{
                            fontSize: "12px",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Popover>

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
              <Tooltip title={mode === "dark" ? "Light Mode" : "Dark Mode"}>
                <IconButton onClick={toggleTheme} color="inherit">
                  {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
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
                    bgcolor:
                      sessionStorage.getItem("role") === "admin"
                        ? "#2f4bd7"
                        : "primary.main",
                    color: "#000",
                  }}
                >
                  {sessionStorage.getItem("role") === "admin"
                    ? "A"
                    : email?.charAt(0)?.toUpperCase()}
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

                {email && role === "admin" && (
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      navigate("/orders");
                    }}
                  >
                    Orders
                  </MenuItem>
                )}
                {email && role === "user" && (
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      navigate("/address");
                    }}
                  >
                    Address
                  </MenuItem>
                )}
                {email && sessionStorage.getItem("role") !== "admin" && (
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
                      sessionStorage.clear();
                      localStorage.removeItem("cartItems");
                      localStorage.removeItem("favorites");
                      navigate("/login");
                      window.location.reload();
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
