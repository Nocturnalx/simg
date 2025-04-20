require('dotenv').config();

exports.verifyAPIKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey === process.env.API_KEY) return next();
    return res.status(403).json({error: "unauthorised upload attempt"});
};