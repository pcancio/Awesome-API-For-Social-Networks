const mongoose = require('mongoose');
const express = require('express');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Social-Network-API', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('debug', true);

const app = express();
const PORT = process.env.PORT || 3001;

