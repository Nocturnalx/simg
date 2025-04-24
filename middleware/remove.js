const path = require("path");
const fs = require("fs");
require('dotenv').config();

const {
    InvalidFolderError,
    FileNotFoundError
} = require('../config/errors');

const validFolders = process.env.FOLDERS.split(',');

const {baseDir} = require('../config/config');


exports.remove = async (req, res, next) => {
    try {
        // Get and verify the folder
        const folder = req.params.folder;
        if (!validFolders.includes(folder)) throw new InvalidFolderError();

        // Get and verify the filename
        const filename = req.params.name;

        // Set the file path
        const filepath = path.join(baseDir, folder, filename);

        // Check if the file exists
        if (!fs.existsSync(filepath)) {
            throw new FileNotFoundError();
        }

        // Delete the file
        fs.unlinkSync(filepath);

        res.json({message: `File ${filename} successfully deleted`});
    } catch (err) {
        next(err);
    }
};
