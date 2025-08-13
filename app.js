const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDB = require("./db/db");

// Connect to Database
connectToDB();

const app = express();

// --- Middleware ---
// It's best practice to group all your middleware together at the top.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- API Routes ---
// All your API routes should be defined before the deployment section.
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const mapRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapRoutes);
app.use('/rides', rideRoutes);

//-------------------DEPLOYMENT----------------
// This entire block should come AFTER your API routes.

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
    // Serve the static files from the React app
    app.use(express.static(path.join(__dirname1, '../frontend/build')));

    // Handles any requests that don't match the ones above
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, '../frontend/build', 'index.html'));
    });
} else {
    // A simple root route for development/testing
    app.get('/', (req, res) => {
        res.send('API is running in development mode...');
    });
}

//-------------------DEPLOYMENT-----------------

module.exports = app;
