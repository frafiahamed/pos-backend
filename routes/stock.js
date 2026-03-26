const router = require('express').Router();
const db = require('../db');

// IN
router.post('/in', (req, res) => {
  const { variant_id, quantity } = req.body;

  db.query("UPDATE product_variants SET stock=stock+? WHERE id=?", [quantity, variant_id]);

  db.query(
    "INSERT INTO stock_movements (variant_id, type, quantity, reason) VALUES (?, 'IN', ?, 'PURCHASE')",
    [variant_id, quantity]
  );

  res.send({ success: true });
});

// OUT
router.post('/out', (req, res) => {
  const { variant_id, quantity } = req.body;

  db.query("SELECT stock FROM product_variants WHERE id=?", [variant_id], (err, r) => {
    if (r[0].stock < quantity) return res.send("Out of stock");

    db.query("UPDATE product_variants SET stock=stock-? WHERE id=?", [quantity, variant_id]);

    db.query(
      "INSERT INTO stock_movements (variant_id, type, quantity, reason) VALUES (?, 'OUT', ?, 'SALE')",
      [variant_id, quantity]
    );

    res.send({ success: true });
  });
});

module.exports = router;