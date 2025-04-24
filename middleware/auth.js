require('dotenv').config();

const {InvalidAPIKeyError} = require('../config/errors');

exports.verifyAPIKey = (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];
        if (apiKey === process.env.API_KEY) return next();
        throw new InvalidAPIKeyError();
    } catch (err) {
        next(err);
    }
};