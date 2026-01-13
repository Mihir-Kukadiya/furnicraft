import Address from "../models/Address.js";

const checkUserEmailAccess = (req, emailFromRequest) => {
  if (!req.user || req.user.role !== "user") return false;
  return req.user.email === emailFromRequest;
};

// =================== Get addresses ===================

export const getAddresses = async (req, res) => {
  try {
    const { email } = req.params;

    if (!checkUserEmailAccess(req, email)) {
      return res.status(403).json({ message: "Not allowed to view addresses" });
    }

    const addresses = await Address.find({ userEmail: email });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
};

// =================== Add address ===================

export const addAddress = async (req, res) => {
  try {
    const { userEmail } = req.body;

    if (!checkUserEmailAccess(req, userEmail)) {
      return res.status(403).json({ message: "Not allowed to add address" });
    }

    const existingCount = await Address.countDocuments({ userEmail });
    if (existingCount >= 2) {
      return res.status(400).json({
        message: "You can only save up to 2 addresses.",
      });
    }

    const address = new Address(req.body);
    const saved = await address.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to add address" });
  }
};

// =================== Update address ===================

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Address.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (!checkUserEmailAccess(req, existing.userEmail)) {
      return res.status(403).json({ message: "Not allowed to update address" });
    }

    const updated = await Address.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update address" });
  }
};

// =================== Delete address ===================

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Address.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (!checkUserEmailAccess(req, existing.userEmail)) {
      return res.status(403).json({ message: "Not allowed to delete address" });
    }

    await Address.findByIdAndDelete(id);
    res.json({ message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete address" });
  }
};
