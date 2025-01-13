const express = require('express');
const offerController = require('./../controllers/offerController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.post(
  '/createOffer/:id',
  authController.restrictTo('worker'),
  offerController.createOffer
);

router.get(
  '/getMyOffers',
  authController.restrictTo('worker'),
  offerController.getMyOffers
);

router.get(
  '/getOrderOffer/:id',
  authController.restrictTo('client'),
  offerController.getOrderOffers
);

router.get('/getOffer', offerController.getOffer);

router.delete(
  '/deleteOffer/:id',
  authController.restrictTo('worker'),
  offerController.deleteMyOffer
);

router.patch(
  '/updateOffer/:id',
  authController.restrictTo('client'),
  offerController.updateOffer
);

module.exports = router;
