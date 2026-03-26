const router = require('express').Router();
const db = require('../db');

// Add Variant
router.post('/', (req, res) => {
  const { product_id, sku, barcode, color, size, price, stock, image_url } = req.body;

  db.query(
    `INSERT INTO product_variants 
     (product_id, sku, barcode, color, size, price, stock, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [product_id, sku, barcode, color, size, price, stock, image_url],
    (err) => res.send(err || { success: true })
  );
});

// Scan Barcode
router.get('/barcode/:barcode', (req, res) => {
  db.query(
    `SELECT v.*, p.name 
     FROM product_variants v
     JOIN products p ON v.product_id=p.id
     WHERE v.barcode=?`,
    [req.params.barcode],
    (err, r) => res.send(r[0] || { message: "Not found" })
  );
});

// Get variants by product
router.get('/product/:id', (req, res) => {
  db.query(
    "SELECT * FROM product_variants WHERE product_id=?",
    [req.params.id],
    (err, r) => res.send(r)
  );
});

module.exports = router;