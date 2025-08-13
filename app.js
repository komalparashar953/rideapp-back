const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDB = require("./db/db");

connectToDB();
const app = express();

// Configure CORS for your future frontend URL
const frontendURL = process.env.FRONTEND_URL;
app.use(cors({
    origin: frontendURL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/users', require("./routes/user.routes"));
app.use('/captains', require("./routes/captain.routes"));
app.use('/maps', require('./routes/maps.routes'));
app.use('/rides', require('./routes/ride.routes'));

// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT;

module.exports = app;
