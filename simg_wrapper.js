require('dotenv').config();

//make sure the folders in folders.json exist - create if not
const {checkFolders} = require('./lib/folders');
const folders = process.env.FOLDERS.split(',');

checkFolders(folders);


//create express app and set port to listen
const app = require('./app');

const express = require('express');
const wrapper = express();
wrapper.use('/simg', app);

const PORT = process.env.PORT;

wrapper.listen(PORT, ()=>{
	console.log(`image server listening on ${PORT}`);
});