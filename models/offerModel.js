const mongoose = require('mongoose');

const offerSchema = mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    offerDescription: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    offerStatus: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
offerSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'worker',
    select: 'name photo',
  }).populate({
    path: 'order',
    select: 'orderTitle',
  });
  next();
});
const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
