const router = require('express').Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { name, parent_id } = req.body;
  db.query(
    "INSERT INTO categories (name, parent_id) VALUES (?, ?)",
    [name, parent_id || null],
    (err, r) => res.send(err || { id: r.insertId })
  );
});

router.get('/', (req, res) => {
  db.query("SELECT * FROM categories", (err, r) => res.send(r));
});

module.exports = router;