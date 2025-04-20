const express = require("express");
const app = express();

//import middleware from middleware folder
const io = require('./middleware/io');
const auth = require('./middleware/auth');

//define routes and assign middleware functions for them
app.post('/upload/:folder', auth.verifyAPIKey, io.upload);
app.get('/image/:folder/:name', io.download);

module.exports = app;