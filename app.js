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
    const purchaseData = req.body; // Rename to purchaseData
    fs.readFile('purchaseItems.json', 'utf8', (err, purchaseItemsData) => { // Rename to purchaseItemsData
      if (err && err.code !== 'ENOENT') {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      let itemsPurchased = [];
      if (purchaseItemsData) {
        try {
          itemsPurchased = JSON.parse(purchaseItemsData);
        } catch (jsonParseError) {
          console.error(jsonParseError);
          return res.status(500).json({ error: 'JSON Parse Error' });
        }
      }
  
      itemsPurchased.push({ ...purchaseData, timestamp: new Date() });
  
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
