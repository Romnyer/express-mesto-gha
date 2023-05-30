const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const app = express();

// Environment vars
const { PORT = 3000 } = process.env;

// Connect to data base
mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {});

// Parser
app.use(express.json());

// Middlewares
app.use((req, res, next) => {
  req.user = {
    _id: '64732ffcf59598341e71a146',
  };

  next();
});

// Routing
app.use('/', router);

// Set port
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
