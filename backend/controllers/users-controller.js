const uuid = require('uuid');
const {validationResult} = require('express-validator');

const HttpError = require('./../models/http-error');
const User = require('../models/user');

const DUMMY_USERS = [
    {
        "id": "u1",
        "name": "Vinay Chaurasia",
        "email": "test@test.com",
        "password": "testing"
    }
]

const getUsers = async (req, res, next) => {
    let users;

    try {
        users = await User.find({}, '-password');
    } catch (err) {
        return next(new HttpError("Fetching user failed, please try again", 500));
    }

    if(!users){
        return next(new HttpError('No user found!', 200));
    }

    res.status(200).json({users: users.map(user => user.toObject({getters: true}))});
};

const login = async (req, res, next) => {
    const {email, password} = req.body;

    let identifiedUser;
    try {
        identifiedUser = await User.findOne({email: email}) ;
    } catch (err) {
        const error = new HttpError('Logging in failed, Please try again', 500);
        return next(error);
    }

    if(!identifiedUser || password !== identifiedUser.password){
        return next(new HttpError('Wrong email or password, please provide valid credentials', 401));
    }

    res.json({message: "Login Successful"});
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError('Invalid inputs passes, please Check input data', 422));
    }
    const {name, email, password} = req.body;

    let hasEmail;
    try {
        hasEmail = await User.findOne({email: email});
    } catch (err) {
        const error = new HttpError('Signing up failed, Please try again later', 500);
        return next(error);
    }

    if(hasEmail){
        const error = new HttpError('Could not create, Email Already Exists.', 422);
        return next(error);
    }

    const createUser = new User({
        name,
        email,
        password,
        image: 'https://www.techfunnel.com/wp-content/uploads/2017/12/7-Types-of-Hackers.jpg',
        places: []
    });

    try {
        await createUser.save();
    } catch (err) {
        const error = new HttpError('Signing up failed, please try again', 500);
        return next(error);
    }
    res.status(201).json({user: createUser.toObject({getters: true})});
};


exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;