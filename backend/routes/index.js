const express = require('express');
const expressJwt = require('express-jwt');
const config = require('../config');

const authRoute = require('./auth');
const userRoute = require('./users');
const restaurantRoute = require('./restaurants');
const profileRoute = require('./profile');

const router = express.Router();
const authMiddleware = expressJwt({ secret: config.jwtSecret });

router.use('/auth', authRoute);
router.use('/users', authMiddleware, userRoute);
router.use('/restaurants', authMiddleware, restaurantRoute);
router.use('/profile', authMiddleware, profileRoute);

module.exports = router;
