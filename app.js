//Library declaration
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Imports
const Book = require('./models/bookModel'); //Book model import
const bookRouter = require('./routes/bookRouter')(Book); //request functionality

//Create instance of express and connect to database
const app = express();
const db = mongoose.connect('mongodb://localhost/bookAPI');
const port = process.env.PORT || 5000;

//body parser to extract relevant information
app.use(bodyParser.urlencoded({ extended: true })); //parses url
app.use(bodyParser.json()); //parses raw data

//at /api, set all routes from bookRouter
app.use('/api', bookRouter);

//If get request is sent to root, output hi at port 4000/5000
app.get('/', (req, res) => {
    res.send('hi');
});

//Listen to results from api on port 4000/5000
app.listen(port, () => {
    console.log(`Running on port ${port}`);
});