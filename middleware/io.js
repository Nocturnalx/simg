const path = require("path");
const fs = require("fs");
const { pipeline } = require('stream/promises');
require('dotenv').config();

const {
    InvalidFolderError,
    MissingFilenameError,
} = require('../config/errors');

const validFolders = process.env.FOLDERS.split(',');

const {baseDir} = require('../config/config');

exports.upload = async (req, res, next) => {
    try {
        //get + verify folder
        const folder = req.params.folder;
        if (!validFolders.includes(folder)) throw new InvalidFolderError(); 
        
        //get + verify filename
        const filename = req.headers['x-filename'];
        if (!filename) throw new MissingFilenameError();

        //write to file
        const filepath = path.join(baseDir, folder, filename);
        const writeStream = fs.createWriteStream(filepath);
        await pipeline(req, writeStream);

        res.json({name: filename});
    } catch (err) {
        next(err);
    }
}

exports.download = (req, res, next) => {
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
        next(err);
    }
};