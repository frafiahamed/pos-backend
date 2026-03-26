const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Prog@12345',
  database: 'pos_db'
});

db.connect(err => {
  if (err) console.error(err);
  else console.log("DB Connected");
});

module.exports = db;