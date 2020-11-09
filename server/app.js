const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require("./config/db")
var bodyParser = require('body-parser');

const app = express();

dotenv.config({ path: './config/config.env' })
connectDB()


// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'false' }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
  
app.use(cors())

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/post', require('./routes/post'));
app.use('/user', require('./routes/user'));

const PORT = process.env.PORT || 6000

app.listen(PORT, console.log("Running on port", PORT, "mode", process.env.NODE_ENV))