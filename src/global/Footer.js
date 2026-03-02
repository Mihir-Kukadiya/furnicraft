import React from "react";
import { Box, Typography, Divider, Link as MuiLink } from "@mui/material";
import {
  Facebook,
  Instagram,
  LinkedIn,
  LocationOn,
  Email,
  Phone,
  HelpOutline,
  Policy,
  Gavel,
} from "@mui/icons-material";
import { FaXTwitter } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";

const Footer = () => {

  // ============================== Navigation Items ===============================

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Products", href: "#products" },
    { label: "Expensive", href: "#expensive" },
    { label: "About Us", href: "#about" },
    { label: "Contact Us", href: "#contact" },
    { label: "Login", href: "#login" },
  ];

  // ============================== Customer Support ===============================

  const customerSupport = [
    { icon: <HelpOutline />, label: "FAQs", href: "#home" },
    { icon: <Policy />, label: "Return Policy", href: "#home" },
    { icon: <Gavel />, label: "Terms & Conditions", href: "#home" },
  ];

  // ============================== Contact Us ===============================

  const contactUs = [
    { icon: <LocationOn />, label: "Surat, Gujarat, India" },
    { icon: <Email />, label: "mkukadiya001@gmail.com" },
    { icon: <Phone />, label: "+91 79908 56214" },
  ];

  // ============================== Social Icons ===============================

  const socialIcons = [
    { icon: <Facebook />, link: "https://www.facebook.com" },
    { icon: <Instagram />, link: "https://www.instagram.com" },
    { icon: <FaXTwitter />, link: "https://www.twitter.com" },
    { icon: <LinkedIn />, link: "https://www.linkedin.com" },
  ];

  // ================================ click nav items ===============================

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (href) => {
    if (href === "/") {
      if (location.pathname !== "/") {
        navigate("/");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
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
    }
  };

  // =======================================================================

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1e1e1e",
        color: "white",
        pt: 6,
        pb: 3,
        px: { xs: 3, sm: 10 },
      }}
    >
      <Box
        className="row"
        sx={{
          mb: 5,
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 4, md: 0 },
          justifyContent: "space-between",
        }}
      >
        <Box
          className="col-md-3 col-12 mb-4"
          sx={{
            flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" },
            minWidth: 250,
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            FurniCraft
          </Typography>
          <Typography variant="body2" color="grey.400">
            Elevate your space with premium furniture that blends style with
            comfort. Designed to suit every taste and need.
          </Typography>
        </Box>
        <Box
          className="col-md-3 col-12 mb-4"
          sx={{
            flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" },
            minWidth: 250,
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Quick Links
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {navItems.map((item, index) => (
              <MuiLink
                key={index}
                component="button"
                underline="none"
                onClick={() => handleNavClick(item.href)}
                sx={{
                  position: "relative",
                  display: "inline",
                  color: "#fff",
                  width: "fit-content",
                  transition: "color 0.3s ease",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    height: "2px",
                    width: 0,
                    backgroundColor: "#1976D2",
                    transition: ".3s",
                  },
                  "&:hover": {
                    color: "#1976D2",
                  },
                  "&:hover::after": {
                    width: "100%",
                  },
                }}
              >
                <Typography variant="body2" component="span">
                  {item.label}
                </Typography>
              </MuiLink>
            ))}
          </Box>
        </Box>
        <Box
          className="col-md-3 col-12 mb-4"
          sx={{
            flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" },
            minWidth: 250,
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Customer Support
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {customerSupport.map((item, index) => {
              return (
                <MuiLink
                  key={index}
                  href={item.href}
                  underline="none"
                  sx={{
                    position: "relative",
                    display: "flex",
                    color: "#fff",
                    width: "fit-content",
                    transition: "color 0.3s ease",
                  }}
                >
                  <Box>
                    {React.cloneElement(item.icon, {
                      sx: { fontSize: "20px" },
                    })}
                  </Box>
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{
                      paddingLeft: "7px",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: "100%",
                        left: "0",
                        marginLeft: "25px",
                        height: "2px",
                        width: 0,
                        backgroundColor: "#1976D2",
                        transition: ".3s",
                      },
                      "&:hover": {
                        color: "#1976D2",
                      },
                      "&:hover::after": {
                        width: "100%",
                      },
                    }}
                  >
                    {item.label}
                  </Typography>
                </MuiLink>
              );
            })}
          </Box>
        </Box>

        <Box
          className="col-md-3 col-12 mb-4"
          sx={{
            flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" },
            minWidth: 250,
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Contact Us
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {contactUs.map((item, index) => {
              return (
                <MuiLink
                  key={index}
                  href={item.href}
                  underline="none"
                  sx={{
                    position: "relative",
                    display: "flex",
                    color: "#fff",
                    width: "fit-content",
                    transition: "color 0.3s ease",
                  }}
                >
                  <Box>
                    {React.cloneElement(item.icon, {
                      sx: { fontSize: "20px" },
                    })}
                  </Box>
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{
                      paddingLeft: "7px",
                    }}
                  >
                    {item.label}
                  </Typography>
                </MuiLink>
              );
            })}
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 3, backgroundColor: "grey.700" }} />

      <Box
        className="row"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: { xs: 2, sm: 0 },
          textAlign: { xs: "center", sm: "start" },
        }}
      >
        <Box className="col-12 col-sm-6 mb-2">
          <Typography variant="body2" color="grey.500">
            © {new Date().getFullYear()} FurniStyle. All rights reserved.
          </Typography>
        </Box>
        <Box
          className="col-12 col-sm-6 text-sm-end"
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-end" },
            gap: 1.5,
          }}
        >
          {socialIcons.map((item, index) => (
            <MuiLink
              href={item.link}
              key={index}
              sx={{
                transition: ".3s",
                cursor: "pointer",
                color: "#fff",
                "&:hover": {
                  color: "#1976D2",
                },
              }}
            >
              {item.icon}
            </MuiLink>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
