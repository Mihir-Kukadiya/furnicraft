import React from "react";
import { Box, Button, Typography } from "@mui/material";
import bgImg from "../images/Home/bg.jpg";

const Home = () => {
  return (
    <Box
      id="home"
      sx={{
        height: "100vh",
        width: "100%",
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          p: 4,
          borderRadius: 2,
          paddingTop: "200px",
        }}
      >
        <Typography variant="h2" fontWeight="bold">
          Welcome to FurniCraft
        </Typography>
        <Typography variant="h6" mt={2}>
          Style your home with modern furniture
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 3 }}>
          Explore Now
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
