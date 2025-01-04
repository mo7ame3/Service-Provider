const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
      maxLength: [50, 'Name must have less or equal than 50 characters'],
      minLength: [2, 'Name must have more or equal than 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email address!'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'User must have a password'],
      minLength: [8, 'Password must have more or equal than 8 characters'],
      select: false, // This will exclude the password field by default
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: 'Passwords do not match',
      },
      select: false,
    },
    photo: String,

    passwordChangeAt: Date,
    role: {
      type: String,
      enum: ['client', 'worker', 'admin'],
      default: 'client',
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});
userSchema.methods.correctPassword = async function (
  condiatedPassword,
  userPassword
) {
  return await bcrypt.compare(condiatedPassword, userPassword);
};

userSchema.methods.changePassword = async function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangeAt = Date.now() - 1000;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
