const express = require('express');
const orderController = require('./../controllers/orderController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('createOrder/:id')
  .post(
    authController.restrictTo('client'),
    orderController.uploadOrderImage,
    orderController.createOrder
  );
router.patch(
  '/updateOrder/:id',
  authController.restrictTo('client'),
  orderController.uploadOrderImage,
  orderController.updateOrder
);
router.get('/getOrder', orderController.getOrder);
router.get('/getMyOrder', orderController.getMyOrder);
router.get('/getOrderInCraft/:id', orderController.getOrderInCraft);
router.delete('/deleteOrder/:id', orderController.getOrderInCraft);
module.exports = router;
