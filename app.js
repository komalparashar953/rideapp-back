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
    const buildPath = path.join(__dirname1, '../frontend/build');
    const indexPath = path.join(__dirname1, '../frontend/build', 'index.html');

    // Add these logs
    console.log('Serving static files from:', buildPath);
    console.log('Serving index.html from:', indexPath);

    app.use(express.static(buildPath));

    app.get('*', (req, res) => {
        res.sendFile(indexPath);
    });
}

//-------------------DEPLOYMENT-----------------

module.exports = app;
