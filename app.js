const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Page Not Found' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
