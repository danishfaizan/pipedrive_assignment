const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const config = require('./config');
const routes = require('./routes');
require('./loaders/sequelize');

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());

app.use('/api', routes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const { message } = error;
  res.status(status).send({ message });
});

app.listen(config.HTTP_SERVER_PORT, () => {
  console.log(`Server started on port ${config.HTTP_SERVER_PORT}`);
});
