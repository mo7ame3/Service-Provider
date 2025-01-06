const Craft = require('./../models/craftModel');
const catchAsync = require('./../utils/catchAsync');
const upload = require('../cloudinary/upload');
const cloudinary = require('./../cloudinary/cloudinary');
const factory = require('./handlerFactory');

exports.uploadCraftImage = upload.single('craftImage');

exports.createCraft = catchAsync(async (req, res, next) => {
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    req.body.craftImage = result.secure_url;
  }
  const newCraft = await Craft.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      craft: newCraft,
    },
  });
});

exports.updateCraft = catchAsync(async (req, res, next) => {
  let updateCraft;
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    req.body.craftImage = result.secure_url;
    updateCraft = await Craft.findByIdAndUpdate(req.query.id, req.body, {
      new: true,
      runValidators: true,
    });
  } else {
    updateCraft = await Craft.findByIdAndUpdate(req.query.id, req.body, {
      new: true,
      runValidators: true,
    });
  }
  if (!updateCraft)
    return next(new appError('No document found with that ID', 404));
  res.status(200).json({
    status: 'success',
    data: {
      data: updateCraft,
    },
  });
});

exports.getAllCraft = factory.getAll(Craft);
exports.getCraft = factory.getOne(Craft);
exports.deleteCraft = factory.deleteOne(Craft);
