//routes -> controllers -> services -> models


const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const auth = require('../middlewares/auth.middleware');

router.post(
  '/create',
  auth.authUser,
  body('pickup').isString().isLength({ min: 4 }),
  body('destination').isString().isLength({ min: 4 }),
  body('vehicleType').isString().isIn(['RideGo', 'RidePremium', 'RideAuto', 'RideMoto']),
  rideController.createRide
);

router.post(
  '/request',
  auth.authUser,
  body('rideId').isMongoId(),
  rideController.requestRideToCaptains
);

router.post(
  '/confirm',
  auth.authCaptain,
  body('rideId').isMongoId(),
  rideController.confirmRide
);

router.get(
  '/get-fare',
  auth.authUser,
  query('pickup').isString().isLength({ min: 4 }),
  query('destination').isString().isLength({ min: 4 }),
  rideController.getFare
);

router.get('/start-ride',
  auth.authCaptain,
  query('rideId').isMongoId().withMessage('Invalid ride id'),
  query('otp').isString().isLength({ min:6, max:6 }).withMessage('Invalid otp'),
  rideController.startRide
)

router.post('/end-ride',
  auth.authCaptain,
  body('rideId').isMongoId().withMessage('Invalid ride id'),
  rideController.endRide
)

module.exports = router;
