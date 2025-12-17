import Favorite from "../models/Favorites.js";

// ======================= Get Favorites =====================

const getFavorites = async (req, res) => {
  const { email } = req.params;
  const fav = await Favorite.findOne({ userEmail: email });
  res.json(fav?.items || []);
};

// ======================== Toggle Favorite =====================

const toggleFavorite = async (req, res) => {
  const { email, product } = req.body;

  let fav = await Favorite.findOne({ userEmail: email });
  if (!fav) fav = new Favorite({ userEmail: email, items: [] });

  const exists = fav.items.find((i) => i.productId === product.productId);

  if (exists) {
    fav.items = fav.items.filter((i) => i.productId !== product.productId);
    await fav.save();
    return res.json({ message: "removed", favorites: fav.items });
  }

  fav.items.push(product);
  await fav.save();
  return res.json({ message: "added", favorites: fav.items });
};

// ======================= Remove Favorite =====================

const removeFavorite = async (req, res) => {
  const { email, productId } = req.body;
  const fav = await Favorite.findOne({ userEmail: email });

  fav.items = fav.items.filter((i) => i.productId !== productId);
  await fav.save();
  res.json(fav.items);
};

const clearFavorites = async (req, res) => {
  await Favorite.findOneAndDelete({ userEmail: req.params.email });
  res.json({ message: "cleared" });
};

export { getFavorites, toggleFavorite, removeFavorite, clearFavorites };
