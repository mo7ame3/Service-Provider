const Order = require('./../models/orderModel');
const catchAsync = require('./../utils/catchAsync');
const upload = require('../cloudinary/upload');
const cloudinary = require('./../cloudinary/cloudinary');
const factory = require('./handlerFactory');
const appError = require('./../utils/appError');

exports.uploadOrderImage = upload.single('orderPhoto');

exports.createOrder = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  req.body.craft = req.params.id;
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    req.body.orderPhoto = result.secure_url;
  }
  const newOrder = await Order.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      order: newOrder,
    },
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const oldOrder = await Order.find({
    _id: req.params.id,
    user: req.user.id,
  });
  if (oldOrder.length === 0) {
    return next(
      new appError('You do not have permission to access this roder', 404)
    );
  }
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    req.body.orderPhoto = result.secure_url;
  }
  const updatedOrder = await Order.findByIdAndUpdate(oldOrder[0].id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedOrder) {
    return next(new appError('No order found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      order: updatedOrder,
    },
  });
});

exports.getMyOrder = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });
  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
  });
});

exports.getOrderInCraft = catchAsync(async (req, res, next) => {
  const orders = await Order.find({
    craft: req.params.id,
    orderStatus: 'pending',
  });
  if (orders.length === 0) {
    return next(new appError('No pending order found in this craft', 404));
  }

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
  });
});

exports.getOrder = factory.getOne(Order);
exports.deleteMyOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return next(new appError('No order found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
