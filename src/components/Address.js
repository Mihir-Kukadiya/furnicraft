import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axiosInstance from "../utils/axiosInstance";

const Address = () => {
  // ============================= address fields ===============================

  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    mobile: "",
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [errors, setErrors] = useState({});

  // ============================ local storage key ===============================

  const email = sessionStorage.getItem("email");
  const storageKey = email ? `addresses_${email}` : "addresses_guest";

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setAddresses(JSON.parse(stored));
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(addresses));
  }, [addresses, storageKey]);

  // ============================= fetch address ===============================

  useEffect(() => {
    if (!email) return;

    axiosInstance
      .get(`/addresses/${email}`)
      .then((res) => setAddresses(res.data))
      .catch((err) =>
        console.error("Fetch address error:", err.response?.data || err.message)
      );
  }, [email]);

  const fetchAddresses = async () => {
    const res = await axiosInstance.get(`/addresses/${email}`);
    setAddresses(res.data);
  };

  useEffect(() => {
    if (email) fetchAddresses();
  }, [email]);

  // ===================== Auto generate city & state when pincode is 6 digits ==================

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "pincode" && value.length === 6) {
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${value}`
        );
        const data = await res.json();
        if (data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          setForm((prev) => ({
            ...prev,
            city: postOffice.District,
            state: postOffice.State,
            pincode: value,
          }));
        }
      } catch (err) {
        console.error("Error fetching pincode details:", err);
      }
    }
  };

  // ========================= Validate form fields ==============================

  const validate = () => {
    let newErrors = {};

    if (!/^[A-Za-z ]+$/.test(form.name)) {
      newErrors.name = "Full Name must contain only letters";
    }

    if (!/^[0-9]{10}$/.test(form.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    if (
      !form.name ||
      !form.street ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      newErrors.general = "Please fill in all fields.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ========================== Add address =============================

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = { ...form, userEmail: email };

    try {
      if (editIndex !== -1) {
        const id = addresses[editIndex]._id;

        const res = await axiosInstance.put(`/addresses/${id}`, payload);

        setAddresses((prev) =>
          prev.map((a, i) => (i === editIndex ? res.data : a))
        );
        setEditIndex(-1);
      } else {
        if (addresses.length >= 2) {
          alert("You can only save up to 2 addresses.");
          return;
        }

        const res = await axiosInstance.post(`/addresses`, payload);
        setAddresses((prev) => [...prev, res.data]);
      }

      setForm({
        name: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        mobile: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to save address");
    }
  };

  // ========================== Edit address =============================

  const handleEdit = (index) => {
    setForm(addresses[index]);
    setEditIndex(index);
  };

  // ========================== Delete address =============================

  const handleDelete = async (index) => {
    const id = addresses[index]._id;

    await axiosInstance.delete(`/addresses/${id}`);
    setAddresses((prev) => prev.filter((_, i) => i !== index));
  };

  // ===================================================================

  return (
    <Box sx={{ paddingTop: "90px", px: { xs: 2, md: 5 } }}>
      <Typography
        variant="h3"
        fontWeight="bold"
        gutterBottom
        sx={{
          fontSize: { xs: "2rem", md: "2.5rem" },
          textAlign: { xs: "center", md: "left" },
        }}
      >
        Manage Your Addresses
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ paddingTop: "20px" }}>
        <Grid container spacing={2} sx={{ gap: 2, flexDirection: "column" }}>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="standard"
              label="Full Name"
              name="name"
              fullWidth
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              variant="standard"
              label="Mobile Number"
              name="mobile"
              type="tel"
              inputProps={{ maxLength: 10 }}
              fullWidth
              value={form.mobile}
              onChange={handleChange}
              error={!!errors.mobile}
              helperText={errors.mobile}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              variant="standard"
              label="Street Address"
              name="street"
              fullWidth
              value={form.street}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              variant="standard"
              label="City"
              name="city"
              fullWidth
              value={form.city}
              onChange={handleChange}
              required
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              variant="standard"
              label="State"
              name="state"
              fullWidth
              value={form.state}
              onChange={handleChange}
              required
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              variant="standard"
              label="Pincode"
              name="pincode"
              fullWidth
              value={form.pincode}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            {errors.general && (
              <Typography color="error" variant="body2">
                {errors.general}
              </Typography>
            )}
            <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
              {editIndex !== -1 ? "Update Address" : "Add Address"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ width: "100%", pt: 3, pb: 3 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {addresses.map((addr, index) => (
            <Box
              key={index}
              sx={{
                flex: "1 1 300px",
                minWidth: "280px",
                maxWidth: "100%",
              }}
            >
              <Card
                variant="outlined"
                sx={{ height: "100%", position: "relative" }}
              >
                <CardContent>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <IconButton
                      onClick={() => handleEdit(index)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                    Address {index + 1}
                  </Typography>
                  <Typography variant="h6">{addr.name}</Typography>
                  <Typography>{addr.mobile}</Typography>
                  <Typography>{addr.street}</Typography>
                  <Typography>
                    {addr.city}, {addr.state} - {addr.pincode}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Address;
