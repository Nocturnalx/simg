const path = require("path");
const fs = require("fs");
require('dotenv').config();

const validFolders = process.env.FOLDERS.split(',');

const {baseDir} = require('../lib/config');


exports.remove = async (req, res) => {
    try {
        // Get and verify the folder
        const folder = req.params.folder;
        if (!validFolders.includes(folder)) return res.status(400).json({error: 'Invalid folder'});

        // Get and verify the filename
        const filename = req.params.name;
        if (!filename) return res.status(400).json({error: 'Missing filename'});

        // Set the file path
        const filepath = path.join(baseDir, folder, filename);

        // Check if the file exists
        if (!fs.existsSync(filepath)) {
            return res.status(404).json({error: 'File not found'});
        }

        // Delete the file
        fs.unlinkSync(filepath);

        res.json({message: `File ${filename} successfully deleted`});
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({error: 'Server error: failed to delete image'});
    }
};
