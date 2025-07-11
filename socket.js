const socketIo = require("socket.io");
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const rideModel = require('./models/ride.model'); // Add this at the top

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('join', async ({ userId, userType }) => {
      if (userType === 'user') {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === 'captain') {
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
      }
    });

    socket.on('update-location-captain', async ({ userId, location }) => {
      if (!location?.ltd || !location?.lng) {
        return socket.emit('error', { message: 'Invalid location data' });
      }
      await captainModel.findByIdAndUpdate(userId, {
        location: { ltd: location.ltd, lng: location.lng }
      });
    });

    socket.on('captain-accepted-ride', async ({ rideId, userSocketId, captainId }) => {
      if (userSocketId && rideId && captainId) {
        // Update the ride with the captain's ID and status
        await rideModel.findByIdAndUpdate(rideId, {
          captain: captainId,
          status: 'accepted'
        });

        // Fetch the updated ride with captain and user populated
        const ride = await rideModel.findById(rideId)
          .populate('user')
          .populate('captain')
          .select('+otp');

        if (ride) {
          io.to(userSocketId).emit('waiting-for-captain', ride);
        }
      }
    });

    // --- NEW: start-ride socket event ---
    socket.on('start-ride', async ({ rideId, otp }) => {
      if (!rideId || !otp) return;
      const ride = await rideModel.findById(rideId)
        .populate('user')
        .populate('captain')
        .select('+otp');

      if (!ride) return;
      if (ride.otp !== otp) return;
      if (ride.status !== 'accepted') return;

      // Update ride status to ongoing
      await rideModel.findByIdAndUpdate(rideId, { status: 'ongoing' });

      // Notify both user and captain
      if (ride.user?.socketId) {
        io.to(ride.user.socketId).emit('ride-started', ride);
      }
      if (ride.captain?.socketId) {
        io.to(ride.captain.socketId).emit('ride-started', ride);
      }
    });
    

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

function sendMessageToSocketId(socketId, messageObject) {
  if (io && socketId) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log('Socket.io not initialized or socketId missing.');
  }
}

module.exports = { initializeSocket, sendMessageToSocketId };
