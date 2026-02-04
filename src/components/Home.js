import React, { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import bg1 from "../images/Home/bg1.jpg";
import bg2 from "../images/Home/bg2.jpg";
import bg3 from "../images/Home/bg3.jpg";

const Home = () => {
  const images = [bg1, bg2, bg3];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [current]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <Box
      id="home"
      sx={{
        height: "100vh",
        width: "100%",
        backgroundImage: `url(${images[current]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        textAlign: "center",
        px: 2,
        transition: "background-image 1s ease-in-out",
        position: "relative",
      }}
    >
      <IconButton
        onClick={prevSlide}
        sx={{
          position: "absolute",
          left: "20px",
          color: "#fff",
          backgroundColor: "rgba(0,0,0,0.4)",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
        }}
      >
        <FaChevronLeft />
      </IconButton>

      <Box
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          pt: { xs: 8, sm: 15 },
          marginBottom: { xs: 4, sm: 15 },
        }}
      >
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{
            fontSize: { xs: "32px", sm: "40px", md: "56px" },
          }}
        >
          Welcome to FurniCraft
        </Typography>

        <Typography
          variant="h6"
          mt={2}
          sx={{ fontSize: { xs: "16px", sm: "18px", md: "20px" } }}
        >
          Style your home with modern furniture
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{
            padding: "8px 14px",
            fontSize: { xs: "10px", sm: "16px" },
            mt: { xs: 1, sm: 3 },
          }}
          onClick={() => {
            const element = document.getElementById("products");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          Explore Now
        </Button>
      </Box>

      <IconButton
        onClick={nextSlide}
        sx={{
          position: "absolute",
          right: "20px",
          color: "#fff",
          backgroundColor: "rgba(0,0,0,0.4)",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
        }}
      >
        <FaChevronRight />
      </IconButton>
    </Box>
  );
};

export default Home;
