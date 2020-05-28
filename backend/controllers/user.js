const User = require('../models/user');
const Restaurant = require('../models/restaurant');
const ROLES = require('../constants');
const baseController = require('./base');
const APIError = require('../error');

function validate({ firstName, lastName, email, password }, next) {
  switch (true) {
    case !firstName:
      return next(new APIError('First name can not be empty', 422));
    case !lastName:
      return next(new APIError('Last name can not be empty', 422));
    case !email:
      return next(new APIError('Email can not be empty', 422));
    case !password:
      return next(new APIError('Password can not be empty', 422));
    case !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email):
      return next(new APIError('Email is not valid', 422));
    default:
      return true;
  }
}

async function create(req, res, next) {
  const { email } = req.body;

  validate(req.body, next);

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

  try {
    const newUser = await user.save();
    res.json(newUser);
  } catch (err) {
    return next(new APIError(err.message, 500));
  }
}

async function update(req, res, next) {
  const { firstName, lastName, email, password, role } = req.body;

  validate(req.body, next);

  Object.assign(req.userModel, {
    firstName,
    lastName,
    email,
    password,
  });

  if (req.user.role === ROLES.ADMIN && role) {
    req.userModel.role = role;
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

async function list(req, res, next) {
  const { filters, sorts, skip, limit } = req.query;
  const where = baseController.listWhere(filters || {});

  where._id = { $ne: req.user._id };

  if (req.user.role === ROLES.OWNER) {
    where.role = { $ne: ROLES.ADMIN };
  }

  const sort = baseController.listSort(sorts || []);

  try {
    const results = await Promise.all([
      User.find(where)
        .sort(sort)
        .skip(skip * 1 || 0)
        .limit(limit * 1 || 10)
        .lean(),
      baseController.getCount(User, where),
    ]);
    const [items, total] = results;

    res.send({
      skip: skip * 1 || 0,
      limit: limit * 1 || 10,
      total,
      data: items,
    });
  } catch (err) {
    return next(new APIError(err.message, 500));
  }
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

async function getUserByID(req, res, next, id) {
  try {
    const user = await User.findById(id);
    if (!user) {
      return next(new APIError('User not found', 404));
    }

    req.userModel = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  update,
  read,
  list,
  remove,
  getUserByID,
};
