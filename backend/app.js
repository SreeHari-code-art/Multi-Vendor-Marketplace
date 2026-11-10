const express = require('express');
const cors = require('cors');
const corsOptions = require('./src/config/corsOptions');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'El servidor del marketplace está funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;