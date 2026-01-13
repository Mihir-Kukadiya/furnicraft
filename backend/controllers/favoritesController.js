import Favorite from "../models/Favorites.js";

const checkUserEmailAccess = (req, emailFromRequest) => {
  if (!req.user || req.user.role !== "user") return false;
  return req.user.email === emailFromRequest;
};

// ======================= Get Favorites =====================
const getFavorites = async (req, res) => {
  try {
    const { email } = req.params;

    if (!checkUserEmailAccess(req, email)) {
      return res.status(403).json({ message: "Not allowed to access favorites" });
    }

    const fav = await Favorite.findOne({ userEmail: email });
    res.json(fav?.items || []);
  } catch (err) {
    res.status(500).json({
      error: "Error fetching favorites",
      details: err.message,
    });
  }
};

// ======================= Add Favorite =====================
const addFavorite = async (req, res) => {
  try {
    const { email, product } = req.body;

    if (!checkUserEmailAccess(req, email)) {
      return res.status(403).json({ message: "Not allowed to add favorites" });
    }

    let fav = await Favorite.findOne({ userEmail: email });
    if (!fav) fav = new Favorite({ userEmail: email, items: [] });

    // ✅ prevent duplicate
    const exists = fav.items.find((i) => i.productId === product.productId);
    if (exists) {
      return res.json({ message: "already", favorites: fav.items });
    }

    fav.items.push(product);
    await fav.save();

    return res.json({ message: "added", favorites: fav.items });
  } catch (err) {
    res.status(500).json({
      error: "Error adding favorite",
      details: err.message,
    });
  }
};

// ======================= Remove Favorite =====================
const removeFavorite = async (req, res) => {
  try {
    const { email, productId } = req.body;

    if (!checkUserEmailAccess(req, email)) {
      return res.status(403).json({ message: "Not allowed to remove favorites" });
    }

    const fav = await Favorite.findOne({ userEmail: email });
    if (!fav) return res.json([]);

    fav.items = fav.items.filter((i) => i.productId !== productId);
    await fav.save();

    res.json(fav.items);
  } catch (err) {
    res.status(500).json({
      error: "Error removing favorite",
      details: err.message,
    });
  }
};

// ======================= Clear Favorites =====================
const clearFavorites = async (req, res) => {
  try {
    const { email } = req.params;

    if (!checkUserEmailAccess(req, email)) {
      return res.status(403).json({ message: "Not allowed to clear favorites" });
    }

    await Favorite.findOneAndDelete({ userEmail: email });
    res.json({ message: "cleared" });
  } catch (err) {
    res.status(500).json({
      error: "Error clearing favorites",
      details: err.message,
    });
  }
};

export { getFavorites, addFavorite, removeFavorite, clearFavorites };
