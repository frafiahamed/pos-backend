const router = require('express').Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { name, description, category_id } = req.body;

  db.query(
    "INSERT INTO products (name, description, category_id) VALUES (?, ?, ?)",
    [name, description, category_id],
    (err, r) => res.send(err || { id: r.insertId })
  );
});

router.get('/category/:id', (req, res) => {
  db.query(
    "SELECT * FROM products WHERE category_id=?",
    [req.params.id],
    (err, r) => res.send(r)
  );
});

module.exports = router;