require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const router = require('./routes/index');
const errorCatcher = require('./middlewares/errorCatcher');

const app = express();

// Environment vars
const { PORT = 3000 } = process.env;

// Connect to data base
mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {});

// Parser
app.use(express.json());

// Routing
app.use('/', router);

// Errors catch middlewares
app.use(errors());
app.use(errorCatcher);

// Set port
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
