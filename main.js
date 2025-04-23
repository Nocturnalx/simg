require('dotenv').config();

//make sure the folders in folders.json exist - create if not
const {checkFolders} = require('./lib/folders');
const folders = process.env.FOLDERS.split(',');

checkFolders(folders);


//create express app and set port to listen
const app = require('./app');
const PORT = 3004;

app.listen(PORT, ()=>{
	console.log(`image server listening on ${PORT}`);
});