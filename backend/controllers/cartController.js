import Cart from "../models/Cart.js";

const checkUserEmailAccess = (req, emailFromRequest) => {
  if (!req.user || req.user.role !== "user") return false;
  return req.user.email === emailFromRequest;
};

// ==================== Get Cart Items =====================

const getCart = async (req, res) => {
  try {
    const { email } = req.params;

    if (!checkUserEmailAccess(req, email)) {
      return res
        .status(403)
        .json({ message: "Not allowed to access this cart" });
    }

    const cart = await Cart.findOne({ userEmail: email });
    res.json(cart?.items || []);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching cart", details: err.message });
  }
};

// ===================== Add to Cart =====================

const addToCart = async (req, res) => {
  try {
    const { email, product } = req.body;

    if (!checkUserEmailAccess(req, email)) {
      return res
        .status(403)
        .json({ message: "Not allowed to modify this cart" });
    }

    let cart = await Cart.findOne({ userEmail: email });

    if (!cart) cart = new Cart({ userEmail: email, items: [] });

    const exists = cart.items.find((i) => i.productId === product.productId);
    if (exists) return res.json({ message: "Already in cart" });

    cart.items.push(product);
    await cart.save();

    res.json({ message: "Added to cart", cart: cart.items });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error adding to cart", details: err.message });
  }
};

// ====================== Update Quantity =====================

const updateQuantity = async (req, res) => {
  try {
    const { email, productId, quantity } = req.body;

    if (!checkUserEmailAccess(req, email)) {
      return res
        .status(403)
        .json({ message: "Not allowed to update this cart" });
    }

    const cart = await Cart.findOne({ userEmail: email });
    if (!cart) return res.json([]);

    const item = cart.items.find((i) => i.productId === productId);
    if (item) item.quantity = quantity;

    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error updating quantity", details: err.message });
  }
};

// ======================= Remove Item ======================

const removeItem = async (req, res) => {
  try {
    const { email, productId } = req.body;

    if (!checkUserEmailAccess(req, email)) {
      return res
        .status(403)
        .json({ message: "Not allowed to remove from this cart" });
    }

    const cart = await Cart.findOne({ userEmail: email });
    if (!cart) return res.json([]);

    cart.items = cart.items.filter((i) => i.productId !== productId);
    await cart.save();

    res.json(cart.items);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error removing item", details: err.message });
  }
};

// ======================== Clear Cart ======================

const clearCart = async (req, res) => {
  try {
    const { email } = req.params;

    if (!checkUserEmailAccess(req, email)) {
      return res
        .status(403)
        .json({ message: "Not allowed to clear this cart" });
    }

    await Cart.findOneAndDelete({ userEmail: email });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error clearing cart", details: err.message });
  }
};

export { getCart, addToCart, updateQuantity, removeItem, clearCart };
