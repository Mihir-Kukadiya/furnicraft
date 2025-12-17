import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

const AboutUs = () => {
  // ========================== our goals ===============================

  const goals = [
    {
      title: "Our Mission",
      description:
        "To craft high-end furniture that elevates comfort, enhances lifestyles, and transforms living spaces with elegance.",
      icon: <EmojiObjectsIcon />,
      color: "primary.main",
    },
    {
      title: "Our Vision",
      description:
        "To become the world’s most trusted brand for luxury furniture by combining sustainable practices with design excellence.",
      icon: <WorkspacePremiumIcon />,
      color: "secondary.main",
    },
    {
      title: "Our Values",
      description:
        "Innovation, sustainability, and customer-first thinking are at the core of everything we create.",
      icon: <PeopleAltIcon />,
      color: "success.main",
    },
    {
      title: "Our Promise",
      description:
        "We commit to delivering unmatched quality, transparent service, and timeless designs that exceed your expectations.",
      icon: <EmojiObjectsIcon />,
      color: "warning.main",
    },
  ];

  // ========================== our members ===============================

  const teamMembers = [
    {
      name: "Mihir Kukadiya",
      role: "Creative Director",
      bio: "Mihir leads with vision and innovation in modern furniture design.",
      contact: "mkukadiya001@gmail.com",
      mobile: "7990856214",
      role_bgcolor: "blue",
    },
    {
      name: "Vatsal Chaudhari",
      role: "Lead Designer",
      bio: "Vatsal crafts pieces that blend beauty and functionality.",
      contact: "vatsal@gmail.com",
      mobile: "9586749037",
      role_bgcolor: "green",
    },
    {
      name: "Harshil Rathod",
      role: "Client Relations",
      bio: "Harshil ensure top-notch client satisfaction.",
      contact: "harshil@gmail.com",
      mobile: "8967485934",
      role_bgcolor: "red",
    },
  ];

  // ========================== member popup ===============================

  const [selectedMember, setSelectedMember] = useState(null);

  const handleOpen = (member) => setSelectedMember(member);
  const handleClose = () => setSelectedMember(null);

  // =======================================================================

  return (
    <Box
      id="about"
      sx={{
        bgcolor: "#fff",
        height: "auto",
        pt: "30px",
      }}
    >
      <Box
        sx={{
          height: "50vh",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{ px: 2, fontSize: { xs: "32px", sm: "42px", md: "56px" } }}
        >
          Crafting Comfort with Elegance
        </Typography>
      </Box>

      <Container maxWidth={false} disableGutters sx={{ py: 6 }}>
        <Typography align="center" fontWeight="bold" gutterBottom
        sx={{
          fontSize: { xs: "2rem", md: "2.5rem" },
        }}>
          About Us
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ maxWidth: 700, mx: "auto", mb: 5 }}
        >
          We are passionate creators of premium furniture designed to bring
          warmth and luxury into every space. Our collections blend timeless
          craftsmanship with modern aesthetics to turn houses into homes.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ width: "100%", mb: 6, px: { xs: 2, sm: 3 } }}>
          {(() => {
            const cardsPerRow = 4;
            const rows = [];
            for (let i = 0; i < goals.length; i += cardsPerRow) {
              rows.push(goals.slice(i, i + cardsPerRow));
            }

            return rows.map((row, rowIndex) => (
              <Box
                key={rowIndex}
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: { xs: "center", lg: "space-between" },
                  gap: 3,
                  mb: 3,
                }}
              >
                {row.map((val, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      flex: "1 1 calc(100% - 24px)",
                      minWidth: {
                        xs: "100%",
                        sm: "calc(50% - 24px)",
                        md: "calc(33.33% - 24px)",
                        lg: "calc(25% - 24px)",
                      },
                      maxWidth: {
                        xs: "100%",
                        sm: "calc(50% - 24px)",
                        md: "calc(33.33% - 24px)",
                        lg: "calc(25% - 24px)",
                      },
                    }}
                  >
                    <Card
                      sx={{
                        p: { xs: 2, sm: 3, md: 4 },
                        textAlign: "center",
                        borderRadius: 3,
                        boxShadow: 3,
                        height: "100%",
                      }}
                    >
                      <Avatar sx={{ bgcolor: val.color, mx: "auto", mb: 2 }}>
                        {val.icon}
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">
                        {val.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        {val.description}
                      </Typography>
                    </Card>
                  </Box>
                ))}
              </Box>
            ));
          })()}
        </Box>

        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Meet Our Team
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{
            maxWidth: 700,
            mx: "auto",
            mb: 5,
            px: { xs: 2, sm: 0 },
          }}
        >
          Our dedicated team brings passion, creativity, and craftsmanship to
          every product we build.
        </Typography>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{ px: { xs: 2, sm: 3 } }}
        >
          {teamMembers.map((member, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                onClick={() => handleOpen(member)}
                sx={{
                  textAlign: "center",
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  width: "200px",
                  height: '220px',
                  boxShadow: 2,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <Avatar
                  src={member.image}
                  sx={{
                    width: 80,
                    height: 80,
                    mx: "auto",
                    mb: 2,
                    fontSize: "25px",
                    backgroundColor: member.role_bgcolor,
                  }}
                >
                  {member.image || member.name.charAt(0)}
                </Avatar>
                <Typography variant="h6">{member.name}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mx: "auto",
                    textAlign: "center",
                  }}
                >
                  {member.role}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog
        open={Boolean(selectedMember)}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        {selectedMember && (
          <>
            <DialogContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: { xs: "10px", sm: "15px" },
                  gap: 2,
                }}
              >
                <Avatar
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  sx={{
                    width: 100,
                    height: 100,
                    backgroundColor: selectedMember.role_bgcolor,
                    fontSize: "40px",
                  }}
                >
                  {selectedMember.image || selectedMember.name.charAt(0)}
                </Avatar>

                <DialogTitle
                  sx={{
                    textAlign: "center",
                    fontSize: "30px",
                    fontWeight: "700",
                    p: 0,
                  }}
                >
                  {selectedMember.name}
                </DialogTitle>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{
                    fontSize: "20px",
                  }}
                >
                  {selectedMember.role}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedMember.bio}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <MdEmail /> {selectedMember.contact}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <FaPhoneAlt /> {selectedMember.mobile}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AboutUs;
