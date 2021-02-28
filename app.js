const express = require('express');
const app = express();

require('dotenv').config();

app.get('/', (req, res) => {
  res.send('welcome to r0sin!');
});

app.listen(process.env.PORT, () => {
  console.log('So it begins!');
});