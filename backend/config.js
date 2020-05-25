const dotenv = require('dotenv');

const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  try {
    dotenv.config();
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  port: parseInt(process.env.PORT, 10) || 4000,
  isDev,
  mongoURL: process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-project',
  jwtSecret: process.env.JWT_SECRET || 'myjwtsecret',
  jwtExpires: process.env.JWT_EXPIRES || '30d',
};
