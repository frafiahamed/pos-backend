const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/category', require('./routes/category'));
app.use('/product', require('./routes/product'));
app.use('/variant', require('./routes/variant'));
app.use('/stock', require('./routes/stock'));
app.use('/order', require('./routes/order'));

app.get('/', (req, res) => {
  res.send("POS Backend Running 🚀");
});

app.listen(3000, () => console.log("Server running on 3000"));