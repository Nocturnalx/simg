const express = require("express");
const path = require("path");
const fs = require("fs");


const data = fs.readFileSync('folders.json', 'utf-8');
const folders = JSON.parse(data);

for (const folder of folders) {
	const folderPath = path.resolve(folder.path);
	if (!fs.existsSync(folderPath) || !fs.lstatSync(folderPath).isDirectory()) {
		throw new Error(`Folder "${folder.name}" does NOT exist at ${folderPath}`);
	}
	console.log(`Folder "${folder.name}" exists at ${folderPath}`);
}


const app = express();

const upload = (req, res) => {
    // if !req.headers['x-filename'] throw ;

    const filename = req.headers['x-filename'];
	const filepath = path.join(__dirname, 'uploads', filename);

	const writeStream = fs.createWriteStream(filepath);
	req.pipe(writeStream);

	req.on('end', () => res.send('Image received and saved'));
	req.on('error', err => {
		console.error('Upload error:', err);
		res.status(500).send('Failed to save image');
	});
}

app.post('upload/:folder', upload)