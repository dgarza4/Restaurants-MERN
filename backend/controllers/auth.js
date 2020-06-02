const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');
const APIError = require('../error');

async function login(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new APIError('Email or password can not be empty', 422));
  }

  const user = await User.findOne({ email })
    .select('_id password email firstName lastName role')
    .exec();

  if (!user) {
    return next(new APIError('User not found', 404));
  }

  try {
    await user.authenticate(req.body.password);
  } catch (err) {
    return next(new APIError('Incorrect password', 403));
  }

  const token = jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpires }
  );

  res.json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    token,
  });
}

async function signup(req, res, next) {
  if (await User.findOne({ email: req.body.email })) {
    return next(new APIError('Email is already taken', 409));
  }

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    return next(new APIError(err.message, 500));
  }
}

module.exports = {
  login,
  signup,
};
