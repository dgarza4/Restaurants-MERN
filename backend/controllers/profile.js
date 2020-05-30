const User = require('../models/user');
const APIError = require('../error');

async function update(req, res, next) {
  try {
    const oldProfile = await User.findById(req.user._id);

    if (req.body.firstName) {
      oldProfile.firstName = req.body.firstName;
    }

    if (req.body.lastName) {
      oldProfile.lastName = req.body.lastName;
    }

    if (
      req.body.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(req.body.email)
    ) {
      return next(new APIError('Email is not valid', 422));
    }

    if (req.body.email) {
      oldProfile.email = req.body.email;
    }

    if (req.body.password) {
      oldProfile.password = req.body.password;
    }

    const updatedData = await oldProfile.save();

    res.json(updatedData);
  } catch (err) {
    return next(new APIError(err.message, 500));
  }
}

module.exports = {
  update,
};
