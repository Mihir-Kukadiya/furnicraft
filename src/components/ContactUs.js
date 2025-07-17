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
        pt: "90px",
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
        <Typography variant="h3" fontWeight="bold">
          Get in Touch with Us
        </Typography>
      </Box>

      <Container maxWidth={false} disableGutters sx={{ px: 3, py: 6 }}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Contact Us
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ maxWidth: 700, mx: "auto", mb: 5 }}
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
            <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
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
            <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
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
                sx={{ mt: 4 }}
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
