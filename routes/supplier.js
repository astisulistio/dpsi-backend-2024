const express = require('express');
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const Supplier = require('../models/supplier');

// CREATE Supplier
router.post('/', authenticate, async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ all Suppliers
router.get('/', authenticate, async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    res.json(suppliers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ a single Supplier
router.get('/:id', authenticate, async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (supplier) {
      res.json(supplier);
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE Supplier
router.put('/:id', authenticate, async (req, res) => {
  try {
    const [updated] = await Supplier.update(req.body, {
      where: { supplierID: req.params.id }
    });
    if (updated) {
      const updatedSupplier = await Supplier.findByPk(req.params.id);
      res.json(updatedSupplier);
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE Supplier
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deleted = await Supplier.destroy({
      where: { supplierID: req.params.id }
    });
    if (deleted) {
      res.json({ message: 'Supplier deleted' });
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;