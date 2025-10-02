import React from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  TextField,
  Button,
} from "@mui/material";
import { FaPhoneAlt } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const ContactUs = () => {
  return (
    <Box
      id="contact"
      sx={{
        bgcolor: "#fff",
        height: "auto",
        pt: { xs: "40px", sm: "90px" },
      }}
    >
      <Box
        sx={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1560185127-6ed189bf005a)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#000",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ fontSize: { xs: "28px", sm: "36px", md: "48px" }, p: 0 }}
        >
          Get in Touch with Us
        </Typography>
      </Box>

      <Container
        maxWidth={false}
        disableGutters
        sx={{ px: { xs: 2, sm: 3 }, py: 6 }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{ fontSize: { xs: "24px", sm: "32px" } }}
        >
          Contact Us
        </Typography>

        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{
            maxWidth: 700,
            mx: "auto",
            mb: 5,
            fontSize: { xs: "14px", sm: "16px" },
            px: { xs: 1, sm: 0 },
          }}
        >
          Have questions or need help? Fill out the form and our team will get
          back to you as soon as possible.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <Card sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, boxShadow: 3 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ fontSize: { xs: "18px", sm: "20px" } }}
              >
                Send Us a Message
              </Typography>
              <TextField fullWidth label="Name" margin="normal" />
              <TextField fullWidth label="Email" margin="normal" />
              <TextField fullWidth label="Subject" margin="normal" />
              <TextField
                fullWidth
                label="Message"
                margin="normal"
                multiline
                rows={4}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, borderRadius: 2 }}
              >
                Submit
              </Button>
            </Card>
          </Box>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <Card sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, boxShadow: 3 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ fontSize: { xs: "18px", sm: "20px" } }}
              >
                Our Contact Details
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <FaHome /> &nbsp; B-56 Tulsi darshan soc., Yogichok, Surat.
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <FaPhoneAlt /> &nbsp; +91 79908 56214
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <MdEmail /> &nbsp; mkukadiya001@gmail.com
              </Typography>

              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mt: 4, fontSize: { xs: "18px", sm: "20px" } }}
                gutterBottom
              >
                Working Hours
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monday - Saturday: 10:00 AM - 7:00 PM
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sunday: Closed
              </Typography>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactUs;
