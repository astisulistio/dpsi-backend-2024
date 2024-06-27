const express = require("express");
const router = express.Router();
const Products = require("../models/products");
const { authenticate, authorize } = require("../middleware/auth");

// Endpoint untuk menambahkan produk baru
router.post("/", authenticate, authorize(["admin"]), async (req, res, next) => {
  try {
    await Products.create(req.body);
    res.status(201).json({ message: "Product added successfully" });
  } catch (err) {
    console.error('Error creating product:', err); // Log detail kesalahan
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Endpoint untuk menampilkan semua produk
router.get("/", authenticate, async (req, res, next) => {
  try {
    const products = await Products.findAll();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// Endpoint untuk menampilkan produk berdasarkan ID
router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const product = await Products.findByPk(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    next(err);
  }
});

// Endpoint untuk memperbarui produk berdasarkan ID
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  async (req, res, next) => {
    try {
      const { productName, supplierID, categoryID, unit, price } = req.body;
      const product = await Products.findByPk(req.params.id);
      if (product) {
        product.productName = productName;
        product.supplierID = supplierID;
        product.categoryID = categoryID;
        product.unit = unit;
        product.price = price;
        await product.save();
        res.json(product);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (err) {
      next(err);
    }
  }
);

// Endpoint untuk menghapus produk berdasarkan ID
router.delete("/:id", authenticate, authorize(["admin"]), async (req, res, next) => {
  try {
    const product = await Products.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.json({ message: "Product deleted" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
