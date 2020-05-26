const mongoose = require('mongoose');

const { Schema } = mongoose;

const RestaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    date: {
      type: Date,
    },
    owner: {
      type: Schema.ObjectId,
      ref: 'User',
    },
    averageRate: {
      type: Number,
      default: 0,
    },
    reviewCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Restaurant', RestaurantSchema);
