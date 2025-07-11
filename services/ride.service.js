const rideModel = require('../models/ride.model')
const mapService = require('../services/maps.service')
const crypto = require('crypto')


async function getFare(pickup, destination) {

    if(!pickup || !destination){
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    const baseFare = {
        RideAuto: 40,
        RideGo: 60,
        RidePremium: 80,
        RideMoto: 25
    };

    const perKmRate = {
        RideAuto: 10,
        RideGo: 15,
        RidePremium: 25,
        RideMoto: 5
    };

    const perMinutesRate = {
        RideAuto: 2,
        RideGo: 4,
        RidePremium: 10,
        RideMoto: 1.5
    };

    const fare = {
        RideGo: Math.round(baseFare.RideGo + ((distanceTime.distance.value) / 1000 * perKmRate.RideGo) + ((distanceTime.duration.value) / 60 * perMinutesRate.RideGo)),
        RidePremium: Math.round(baseFare.RidePremium + ((distanceTime.distance.value) / 1000 * perKmRate.RidePremium) + ((distanceTime.duration.value) / 60 * perMinutesRate.RidePremium)),
        RideAuto: Math.round(baseFare.RideAuto + ((distanceTime.distance.value / 1000) * perKmRate.RideAuto) + ((distanceTime.duration.value) / 60 * perMinutesRate.RideAuto)),
        RideMoto: Math.round(baseFare.RideMoto + ((distanceTime.distance.value) / 1000 * perKmRate.RideMoto) + ((distanceTime.duration.value) / 60 * perMinutesRate.RideMoto)),
    }

    return fare;
}

module.exports.getFare = getFare;

function getOTP(num) {
    function generateOTP(num) {
        const otp = crypto.randomInt(Math.pow(10, num-1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOTP(num);
}


module.exports.createRide = async({user, pickup, destination, vehicleType}) => {
    if(!user || !pickup || !destination || !vehicleType)
    {
        throw new Error('All fields are required')
    }

    const fare = await getFare(pickup, destination);

    const ride = rideModel.create({
        user, 
        pickup,
        destination,
        fare: fare[vehicleType],
        otp: getOTP(6)
    })

    return ride;
}

module.exports.confirmRide = async ({rideId, captain}) => {
    if(!rideId || !captain)
    {
        throw new Error('Ride id and captain are required')
    }

    await rideModel.findOneAndUpdate(
         { _id: rideId },
        { status: 'accepted', captain: captain._id }
    );
}

module.exports.startRide = async ({rideId, otp, captain}) =>
{
    if(!rideId || !otp)
    {
        throw new Error('Ride id and otp is required');
    }

    const ride = await rideModel.findOne({_id: rideId}).populate('user').populate('captain').select('+otp');

    if(!ride) 
    {
        throw new Error('Ride not found');
    }

    if(ride.status !== 'accepted')
    {
        throw new Error('ride not accepted');
    }

    if(ride.otp !== otp)
    {
        throw new Error('invalid otp');
    }

    await rideModel.findOneAndUpdate(
        { _id: rideId }, 
        { status: 'ongoing'}
    );

    const updatedRide = await rideModel.findOneAndUpdate(
        { _id: rideId }, 
        { status: 'ongoing'},
        { new: true }
    ).populate('user').populate('captain').select('+otp');
    return updatedRide;
  

}

module.exports.endRide = async ({ rideId, captain }) => {
    if(!rideId)
    {
        throw new Error('RideId is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if(!ride)
    {
        throw new Error('Ride not found');
    }

    if(ride.status !== 'ongoing')
    {
        throw new Error('Ride not ongoing');
    }

    const completeRide = await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    }).populate('user').populate('captain').select('+otp');

    return completeRide;
    
}

