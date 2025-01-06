const mongoose = require('mongoose');

const craftSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Craft name is required'],
    },
    craftImage: {
      type: String,
      required: [true, 'Craft photo is required'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Craft = mongoose.model('Craft', craftSchema);

module.exports = Craft;
