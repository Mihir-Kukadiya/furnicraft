import Cart from "../models/Cart.js";

// ==================== Get Cart Items =====================

const getCart = async (req, res) => {
  try {
    const { email } = req.params;
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
    const cart = await Cart.findOne({ userEmail: email });

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
    await Cart.findOneAndDelete({ userEmail: req.params.email });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error clearing cart", details: err.message });
  }
};

export { getCart, addToCart, updateQuantity, removeItem, clearCart };
