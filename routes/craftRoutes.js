const craftController = require('./../controllers/craftController');
const authController = require('./../controllers/authController');
const express = require('express');
const router = express.Router();

router.use(authController.protect);

router.get('/getAllCrafts', craftController.getAllCraft);
router.get('/getCraft', craftController.getCraft);

router.use(authController.restrictTo('admin'));
router.post(
  '/createCraft',
  craftController.uploadCraftImage,
  craftController.createCraft
);
router.patch(
  '/updateCraft',
  craftController.uploadCraftImage,
  craftController.updateCraft
);
router.delete('/deleteCraft', craftController.deleteCraft);

module.exports = router;
