const express = require("express");
const app = express();

//import middleware from middleware folder
const {upload, download} = require('./middleware/io');
const {verifyAPIKey} = require('./middleware/auth');
const {remove} = require('./middleware/remove');

//define routes and assign middleware functions for them
app.post('/upload/:folder', verifyAPIKey, upload);
app.delete('/remove/:folder/:name', verifyAPIKey, remove);
app.get('/image/:folder/:name', download);

module.exports = app;