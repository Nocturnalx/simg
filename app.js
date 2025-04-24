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

app.use((err, req, res, next) => {

    if (!err.silent) console.error("Error middleware called: ", err);
    if (!err.status) return res.status(500).send('Internal server error');

    res.status(err.status).json({
        error: err.response,
        code: err.errCode
    })
});

module.exports = app;