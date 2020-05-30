const Restaurant = require('../models/restaurant');
const Review = require('../models/review');
const ROLES = require('../constants');

const baseController = require('./base');
const APIError = require('../error');

async function create(req, res, next) {
  const { name } = req.body;

  if (!name) {
    return next(new APIError('Name can not be empty', 422));
  }

  const restaurant = new Restaurant(req.body);

  if (req.user.role === ROLES.USER) {
    return next(new APIError('You are not allowed to add restaurant', 403));
  }

  restaurant.owner =
    req.user.role === ROLES.OWNER ? req.user._id : req.body.owner;

  if (!restaurant.owner) {
    return next(new APIError('Owner can not be empty', 422));
  }

  try {
    const newRestaurant = await restaurant.save();
    res.json(newRestaurant);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  Object.assign(req.restaurant, req.body);
  if (req.user.role === ROLES.ADMIN) {
    try {
      const updatedRestaurant = await req.restaurant.save();
      const populated = await Restaurant.findById(
        updatedRestaurant._id
      ).populate('owner');
      res.json(populated);
    } catch (err) {
      next(err);
    }
  } else {
    return next(new APIError('You are not allowed to update restaurant', 403));
  }
}

async function read(req, res, next) {
  try {
    const authUserReview = await Review.findOne({
      restaurant: req.restaurant._id,
      user: req.user._id,
    });

    const result = await Restaurant.findById(req.restaurant._id).lean();

    res.json({ ...result, authUserReview });
  } catch (err) {
    return next(new APIError(err.message, 500));
  }
}

async function list(req, res, next) {
  const { filters, sorts, skip, limit } = req.query;

  const where = baseController.listWhere(filters || {});
  const sort = baseController.listSort(sorts || []);

  if (req.user.role === ROLES.OWNER) {
    where.owner = req.user._id; // eslint-disable-line
  }

  try {
    const results = await Promise.all([
      Restaurant.find(where)
        .populate('owner')
        .sort(sort)
        .skip(skip * 1 || 0)
        .limit(limit * 1 || 10)
        .lean(),
      baseController.getCount(Restaurant, where),
    ]);
    const [items, total] = results;

    res.send({
      skip: skip * 1 || 0,
      limit: limit * 1 || 10,
      total,
      data: items,
    });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  if (req.user.role !== ROLES.ADMIN) {
    return next(new APIError('You are not allowed to delete restaurant', 403));
  }

  try {
    await req.restaurant.remove();
    res.json(req.restaurant);
  } catch (err) {
    next(err);
  }
}

async function report(req, res, next) {
  try {
    const max = await Review.find({ restaurant: req.restaurant._id })
      .sort([['rate', -1]])
      .limit(1);

    const min = await Review.find({ restaurant: req.restaurant._id })
      .sort([['rate', 1]])
      .limit(1);

    res.json({ max: max[0], min: min[0] });
  } catch (err) {
    next(err);
  }
}

async function getRestaurantByID(req, res, next, id) {
  try {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return next(new APIError('Restaurant not found', 404));
    }

    req.restaurant = restaurant;
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
  report,
  getRestaurantByID,
};
