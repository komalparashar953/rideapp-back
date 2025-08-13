const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const path = require("path")

const cors = require("cors");
app.use(cors());

const connectToDB = require("./db/db");
connectToDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const mapRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');

app.get('/', (req, res) => {
    res.send('Hello');
});



app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapRoutes);
app.use('/rides', rideRoutes);

//-------------------DEPLOYMENT----------------


const __dirname1 = path.resolve();
if(process.env.NODE_ENV === 'production')
{
    app.use(express.static(path.join(__dirname1, '../frontend/build')));

    app.get('/{*splat}', (req, res) => {
        res.sendFile(path.resolve(__dirname1, '../frontend/build', 'index.html'));
    });
}
else
{
    app.get('/', (req, res) => {
        res.send('Hello');
    });
}




//-------------------DEPLOYMENT-----------------

module.exports = app;
