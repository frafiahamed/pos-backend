const router = require('express').Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { items, payment_type } = req.body;

  let total = 0;
  items.forEach(i => total += i.price * i.qty);

  db.query(
    "INSERT INTO orders (total_amount, final_amount, payment_type) VALUES (?, ?, ?)",
    [total, total, payment_type],
    (err, orderRes) => {

      const orderId = orderRes.insertId;

      items.forEach(i => {
        db.query(
          "INSERT INTO order_items (order_id, variant_id, quantity, price, final_price) VALUES (?, ?, ?, ?, ?)",
          [orderId, i.variant_id, i.qty, i.price, i.price]
        );

        db.query(
          "UPDATE product_variants SET stock=stock-? WHERE id=?",
          [i.qty, i.variant_id]
        );

        db.query(
          "INSERT INTO stock_movements (variant_id, type, quantity, reason) VALUES (?, 'OUT', ?, 'SALE')",
          [i.variant_id, i.qty]
        );
      });

      res.send({ success: true, orderId });
    }
  );
});

// GET /order/:id
router.get('/:id', (req, res) => {
    const orderId = req.params.id;
  
    const sql = `
      SELECT 
        oi.*, 
        v.color, v.size, v.sku,
        p.name
      FROM order_items oi
      JOIN product_variants v ON oi.variant_id = v.id
      JOIN products p ON v.product_id = p.id
      WHERE oi.order_id = ?
    `;
  
    db.query(sql, [orderId], (err, items) => {
      if (err) return res.send(err);
  
      db.query(
        `SELECT * FROM orders WHERE id=?`,
        [orderId],
        (err, order) => {
          if (err) return res.send(err);
  
          res.send({
            order: order[0],
            items: items
          });
        }
      );
    });
});

// GET /order?from=2026-03-25&to=2026-03-26
router.get('/', (req, res) => {
    const { from, to } = req.query;
  
    let sql = "SELECT * FROM orders WHERE 1=1";
  
    if (from && to) {
      sql += ` AND DATE(created_at) BETWEEN '${from}' AND '${to}'`;
    }
  
    sql += " ORDER BY created_at DESC";
  
    db.query(sql, (err, result) => res.send(result));
});

// GET /order/summary/today
router.get('/summary/today', (req, res) => {
    db.query(
      `SELECT SUM(final_amount) as total FROM orders WHERE DATE(created_at)=CURDATE()`,
      (err, result) => res.send(result[0])
    );
});

// GET /order/summary?date=2026-03-26
router.get('/summary', (req, res) => {
    const { date } = req.query;
  
    db.query(
      `SELECT SUM(final_amount) as total 
       FROM orders 
       WHERE DATE(created_at)=?`,
      [date],
      (err, result) => res.send(result[0])
    );
});

module.exports = router;