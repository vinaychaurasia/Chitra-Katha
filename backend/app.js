const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
})

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not found the place', 404);
    throw error;
})

app.use((error, req, res, next) => {
    if(res.headerSent){
        return next(error);
    }

    res.status(error.code || 500);
    res.json({message : error.message || 'An unknown error occured!'});
});

mongoose.connect('mongodb+srv://mern:MD7OfobPQ7lhITGM@cluster0.yscad.mongodb.net/Chitra-Katha?retryWrites=true&w=majority')
    .then(() => {
        console.log('DataBase Connected!');
        app.listen(5000, () => {
            console.log('Server is listening on Port 5000');
        })
    })
    .catch(err => {
        console.log(err);   
    });
