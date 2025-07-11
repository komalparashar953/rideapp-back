//controller bnane se phle model bnao then services bnao


const rideService = require('../services/ride.service');
const mapService = require('../services/maps.service');
const rideModel = require('../models/ride.model');
const { validationResult } = require('express-validator');
const { sendMessageToSocketId } = require('../socket');

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { pickup, destination, vehicleType } = req.body;
  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType
    });
    res.status(201).json(ride); 
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { pickup, destination } = req.query;
  try {
    const fare = await rideService.getFare(pickup, destination);
    res.status(200).json(fare);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports.requestRideToCaptains = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { rideId } = req.body;
  try {
    const ride = await rideModel.findById(rideId).populate('user');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    const { ltd, lng } = await mapService.getAddressCoordinate(ride.pickup);
    const captains = await mapService.getCaptainsInTheRadius(ltd, lng, 5);

    captains.forEach(captain => {
      if (captain.socketId) {
        console.log('Emitting new-ride to captain:', captain.socketId, 'for ride:', ride._id);
        sendMessageToSocketId(captain.socketId, {
          event: 'new-ride',
          data: ride
        });
      }
    });

    res.status(200).json({ message: 'Captains notified' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { rideId } = req.body;
  try {
    const ride = await rideService.confirmRide({
      rideId,
      captain: req.captain
    });

    // Notify user with updated ride (with captain populated)
    sendMessageToSocketId(ride.user.socketId, {
      event: 'waiting-for-captain',
      data: ride
    });

    res.status(200).json(ride);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports.startRide = async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty())
  {
    return res.status(400).json({ errors: errors.array() })
  }

  const { rideId, otp } = req.query;

  try{
    const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

    
    sendMessageToSocketId(ride.user.socketId, {
      event: 'ride-started',
      data: ride
    })

    sendMessageToSocketId(ride.captain.socketId, {
      event: 'ride-started',
      data: ride
    });

    return res.status(200).json(ride);
  }
  catch(error){
    return res.status(500).json({ message: error.message});
  }
}

module.exports.endRide = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty())
  {
    return res.status(400).json({ errors: errors.array() })
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.endRide({ rideId, captain: req.captain })

    sendMessageToSocketId(ride.user.socketId, {
      event: 'ride-ended',
      data: ride
    })

    return res.status(200).json(ride);
  }
  catch(error) {
    return res.status(500).json({ message: err.message });
  }
}


