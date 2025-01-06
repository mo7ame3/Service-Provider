// const multer = require('multer');
const Order = require('./../models/orderModel');
const catchAsync = require('./../utils/catchAsync');
const upload = require('../cloudinary/upload');
const cloudinary = require('./../cloudinary/cloudinary');

exports.uploadOrderImage = upload.single('orderPhoto');

exports.createOrder = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
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
