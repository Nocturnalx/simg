const path = require("path");
const fs = require("fs");
const { pipeline } = require('stream/promises');
require('dotenv').config();

const validFolders = process.env.FOLDERS.split(',');

const {baseDir} = require('../config');

exports.upload = async (req, res) => {
    try {
        //get + verify folder
        const folder = req.params.folder;
        if (!validFolders.includes(folder)) return res.status(400).json({error: 'Invalid upload folder'});
        
        //get + verify filename
        const filename = req.headers['x-filename'];
        if (!filename) return res.status(400).json({error: 'Missing filename'});

        //write to file
        const filepath = path.join(baseDir, folder, filename);
        const writeStream = fs.createWriteStream(filepath);
        await pipeline(req, writeStream);

        res.json({name: filename});
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({error: 'Server error: failed to save image'});
    }
}

exports.download = (req, res) => {
    try {
        const { folder, name } = req.params;
        const filepath = path.join(baseDir, folder, name);
        
        fs.access(filepath, fs.constants.F_OK, err => {
            if (err) {
                const fallbackPath = path.join(baseDir, 'fallback', 'fb.png');
                return res.status(404).sendFile(fallbackPath);
            }
            res.sendFile(filepath);
        });

    } catch (err) {
        return res.status(500).json({error: 'Server error'});
    }
};