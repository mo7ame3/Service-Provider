const express = require('express');
const orderController = require('./../controllers/orderController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .post(
    authController.restrictTo('client'),
    orderController.uploadOrderImage,
    orderController.createOrder
  );

module.exports = router;
