const User = require('../models/user');
const Restaurant = require('../models/restaurant');
const ROLES = require('../constants');
const baseController = require('./base');
const APIError = require('../error');

async function create(req, res, next) {
  const { firstName, lastName, email, password } = req.body;

  if ((!firstName, !lastName, !email, !password)) {
    return next(
      new APIError(
        'First name, last name, email or password field can not be empty',
        422
      )
    );
  }

  const existingUsers = await User.find({ email });

  if (existingUsers.length) {
    return next(new APIError('Email is already taken', 409));
  }

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });

  if (req.user.role === ROLES.ADMIN && req.body.role) {
    user.role = req.body.role;
  }

  user
    .save()
    .then((newUser) => {
      res.json(newUser);
    })
    .catch((err) => {
      return next(new APIError(err.message, 500));
    });
}

async function update(req, res, next) {
  if (req.body.firstName) {
    req.userModel.firstName = req.body.firstName;
  }

  if (req.body.lastName) {
    req.userModel.lastName = req.body.lastName;
  }

  if (req.body.email) {
    req.userModel.email = req.body.email;
  }

  if (req.body.password) {
    req.userModel.password = req.body.password;
  }

  if (req.user.role === ROLES.ADMIN && req.body.role) {
    req.userModel.role = req.body.role;
  }

  try {
    const updatedUser = await req.userModel.save();

    if (updatedUser.role !== 'owner') {
      await Restaurant.deleteMany({ owner: updatedUser._id });
    }

    res.json(updatedUser);
  } catch (err) {
    return next(new APIError(err.message, 500));
  }
}

function read(req, res) {
  res.json(req.userModel);
}

function list(req, res, next) {
  const { filters, sorts, skip, limit } = req.query;
  const where = baseController.listWhere(filters || {});

  where._id = { $ne: req.user._id };

  if (req.user.role === ROLES.OWNER) {
    where.role = { $ne: ROLES.ADMIN };
  }

  const sort = baseController.listSort(sorts || []);

  Promise.all([
    User.find(where)
      .sort(sort)
      .skip(skip * 1 || 0)
      .limit(limit * 1 || 20)
      .lean(),
    baseController.getCount(User, where),
  ])
    .then((results) => {
      const [items, total] = results;

      res.send({
        skip: skip * 1 || 0,
        limit: limit * 1 || 20,
        total,
        data: items,
      });
    })
    .catch((err) => {
      return next(new APIError(err.message, 500));
    });
}

async function remove(req, res, next) {
  try {
    await req.userModel.remove();

    if (req.userModel.role === 'owner') {
      await Restaurant.deleteMany({ owner: req.userModel._id });
    }

    res.json(req.userModel);
  } catch (err) {
    return next(new APIError(err.message, 500));
  }
}

function getUserByID(req, res, next, id) {
  User.findById(id)
    .then((user) => {
      if (!user) {
        return next(new APIError('User not found', 404));
      }

      req.userModel = user;
      next();
    })
    .catch(next);
}

module.exports = {
  create,
  update,
  read,
  list,
  remove,
  getUserByID,
};
