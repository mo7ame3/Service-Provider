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
    craft: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Order must belong to a craft!'],
      ref: 'Craft',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'completed', 'in progress'],
      default: 'pending',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  }).populate({
    path: 'craft',
    select: 'name',
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
