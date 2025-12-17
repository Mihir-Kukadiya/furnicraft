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
        alignItems: "center",
        color: "#fff",
        textAlign: "center",
        px: 2,
      }}
    >
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
    </Box>
  );
};

export default Home;
