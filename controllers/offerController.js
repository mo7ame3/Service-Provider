const Offer = require('./../models/offerModel');
const Order = require('./../models/orderModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.createOffer = catchAsync(async (req, res, next) => {
  if (!req.body.worker) req.body.worker = req.user.id;
  if (!req.body.order) req.body.order = req.params.id;
  const newOffer = await Offer.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      data: newOffer,
    },
  });
});

exports.getMyOffers = catchAsync(async (req, res, next) => {
  const myOffer = await Offer.find({ worker: req.user.id });
  if (!myOffer) return next(new appError('No offer found with that ID', 404));
  res.status(200).json({
    status: 'success',
    results: myOffer.length,
    data: {
      data: myOffer,
    },
  });
});

exports.getOrderOffers = catchAsync(async (req, res, next) => {
  const orderOffers = await Offer.find({ order: req.params.id });
  if (!orderOffers)
    return next(new appError('No offer found with that ID', 404));
  if (orderOffers[0].order.user.id !== req.user.id)
    return next(new appError('You are not authorized to view this offer', 401));
  res.status(200).json({
    status: 'success',
    data: {
      data: orderOffers,
    },
  });
});

exports.getOffer = factory.getOne(Offer);

exports.deleteMyOffer = catchAsync(async (req, res, next) => {
  const offer = await Offer.findOne({
    worker: req.user.id,
    order: req.params.id,
  });
  if (!offer) return next(new appError('No offer found with that ID', 404));
  await offer.remove();
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateOffer = catchAsync(async (req, res, next) => {
  if (
    req.body.offerStatus !== 'rejected' &&
    req.body.offerStatus !== 'accepted'
  ) {
    return next(new appError('Please accepted or rejected the offer', 400));
  }
  const offer = await Offer.findOne({ order: req.params.id });
  if (!offer) return next(new appError('No offer found with that ID', 404));
  if (req.body.offerStatus === 'rejected') {
    offer.offerStatus = req.body.offerStatus;
    await offer.save();
  }
  if (req.body.offerStatus === 'accepted') {
    offer.offerStatus = req.body.offerStatus;
    await offer.save();
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderStatus: 'in progress',
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedOrder)
      return next(new appError('No order found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: offer,
    },
  });
});
