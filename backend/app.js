const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');
const APIError = require('./error');

const initializeDB = require('./mongoose');

initializeDB();

const apiRouter = require('./routes');

const app = express();
app.use(morgan('combined'));
app.use(helmet({ frameguard: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/', apiRouter);

app.use((req, res, next) => {
  next(new APIError('API not found', 404));
});

app.use((err, req, res, next1) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message,
    stack: config.isDev ? err.stack : undefined,
  });
});

app.listen(config.port, (err) => {
  if (err) throw err;

  console.log(`> Ready on http://localhost:${config.port}`);
});
