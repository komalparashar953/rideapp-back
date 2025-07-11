const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const captainController = require('../controllers/captain.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register',
  [
    body('fullname.firstname')
      .isLength({ min: 3 })
      .withMessage('Firstname must be at least 3 characters'),
    body('fullname.lastname')
      .isLength({ min: 3 })
      .withMessage('Lastname must be at least 3 characters'),
    body('email')
      .isEmail()
      .withMessage('Please fill a valid email address')
      .isLength({ min: 5 })
      .withMessage('Email must be at least 5 characters'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('vehicle.color')
      .isLength({ min: 3 })
      .withMessage('Color must be at least 3 characters'),
    body('vehicle.plate')
      .isLength({ min: 3 })
      .withMessage('Plate must be at least 3 characters'),
    body('vehicle.capacity')
      .isNumeric()
      .withMessage('Capacity must be a number')
      .isInt({ min: 1 })
      .withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType')
      .isIn(['car', 'bike', 'auto'])
      .withMessage('Vehicle type must be car, bike, or auto'),
  ],
  captainController.registerCaptain
);

router.post('/login',
  [
    body('email').isEmail().withMessage('Please fill a valid email address').isLength({ min: 5 }).withMessage('Email must be at least 5 characters'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  captainController.loginCaptain
);

router.get('/profile', authMiddleware.authCaptain,
  captainController.getCaptainProfile
);

router.get('/logout', authMiddleware.authCaptain,
  captainController.logoutCaptain
);


module.exports = router;