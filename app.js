const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`Server is running on port, ${port}`);
});

app.post('/purchase', (req, res) => {
  const data = req.body;
  fs.readFile('purchaseItems.json', 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    let itemsPurchased = [];
    if (data) {
      try {
        itemsPurchased = JSON.parse(data);
      } catch (jsonParseError) {
        console.error(jsonParseError);
        return res.status(500).json({ error: 'JSON Parse Error' });
      }
    }

    itemsPurchased.push({ ...data, timestamp: new Date() });

    fs.writeFile('purchaseItems.json', JSON.stringify(itemsPurchased), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json({ message: 'Item purchased successfully' });
    });
  });
});

app.get('/products', (req, res) => {
  fs.readFile('products.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const products = JSON.parse(data);
    res.json(products);
  });
});
