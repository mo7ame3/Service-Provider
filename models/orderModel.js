const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderDescription: {
      type: String,
      required: true,
    },
    orderTitle: {
      type: String,
      required: true,
    },
    orderPhoto: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
