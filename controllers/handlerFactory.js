const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.query.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return next(new appError('No document found with that ID', 404));
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log('gggggggggggggggggg');
    const doc = await Model.findByIdAndDelete(req.query.id);
    if (!doc) return next(new appError('No document found with that ID', 404));
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let query = await Model.findById(req.query.id);
    if (!query)
      return next(new appError('No document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: query,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const docs = await Model.find({});
    if (!docs.length) return next(new appError('No documents found', 404));
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });
