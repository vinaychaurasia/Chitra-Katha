const uuid = require('uuid');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const mongooseUniqueValidator = require('mongoose-unique-validator');


let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world',
        imageUrl: 'https://media.timeout.com/images/101705309/image.jpg',
        address: '20 W 29th St, New York, NY 10001',
        creator: 'u1',
        location: {
            lat: 40.7484405,
            lng: -73.9856644
        }
    },
    {
        id: 'p2',
        title: 'lal quila',
        description: 'One of the most famous sky scrapers in the world',
        imageUrl: 'https://media.timeout.com/images/101705309/image.jpg',
        address: '20 W 29th St, New York, NY 10001',
        creator: 'u2',
        location: {
            lat: 40.7484405,
            lng: -73.9856644
        }
    }
];

const getPlacesById = async (req, res, next) => {
    const placeId = req.params.pid // {pid: 'p1'}

    let place
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a place.', 500);
        return next(error);
    }

    if(!place){ // in Syncronouse methods, use "throw" to send error to the middleware
        //     // in Asyncronous methods, use "next()" to send error to the middlewarey
        // const error = new Error("Could not find a place for the provided id.") //Error() takes message argument
        // error.code = 404 //setting code property dynamically
        // throw error; // this will trigger error handling middleware

        const error = new HttpError('Could not find  a place for the provided id.', 404);
        return next(error);
    }

    res.json({place: place.toObject({getters: true})}); // ==> {places} <=> {places: places}
    // place.toObject({getters: true}) => to remove underscore property from _id created by mongodb 
}

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let places;
    try {
        places = await Place.find({creator: userId});
    } catch (err) {
        const error = new HttpError('Something went wrong, Please try again', 500);
        return next(error);
    }

    if(!places || places.length === 0){
        // const error = new Error("Could not find a place for the provided user id.")
        // error.code = 404
        // return next(error); // forwarding to next in-line middleware

        return next( new HttpError("Could not find a places for the provided user id.", 404));
    }

    res.json({places : places.map(place => place.toObject({getters: true}))});
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError('Invalid inputs passes, please check your data.', 422));
    }
    const {title, description, address, creator} = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (err) {
        return next(err);
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        creator,
        location: coordinates,
        image: 'https://www.techfunnel.com/wp-content/uploads/2017/12/7-Types-of-Hackers.jpg'
    });

    // DUMMY_PLACES.push(createdPlace); // or unshift(createdPlace);
    
    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError('Creating place failed, please try again', 500);
        return next(error);
    }

    if(!user){
        return next(new HttpError('Could not find user for provided id', 404));
    }
    console.log(user);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session: sess});
        user.places.push(createdPlace);
        await user.save({session: sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Creating place failed, Please try again', 500);
        return next(error);
    }

    res.status(201).json({
        message: "Place Added", 
        createdPlace
    });
}

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs passes, please check your data.', 422);
    }
    const {title, description} = req.body;
    const placeId = req.params.pid;

    let updatePlace;
    try {
        updatePlace = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update place', 500);
        return next(error);
    }

    updatePlace.title = title;
    updatePlace.description = description;

    try {
        await updatePlace.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not save Updated place', 500);
        return next(error);
    }

    res.status(200).json({place: updatePlace.toObject({getters: true})});
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find place', 500);
        return next(error);
    }

    if(!place){
        return next(new HttpError('Could not find a place of that id.', 404));
    }

    try {
        // await Place.deleteOne({_id: placeId});
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({session: sess});
        place.creator.places.pull(place);
        await place.creator.save({session: sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete place', 500);
        return next(error);
    }

    res.status(200).json({message: "Place Deleted."});
};

exports.getPlacesById = getPlacesById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;