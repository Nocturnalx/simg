exports.checkFolders = (folders) => {

    const path = require("path");
    const fs = require("fs");

    const {baseDir} = require('./config')

    for (const folder of folders) {
        const folderPath = path.join(baseDir, folder);
        if (!fs.existsSync(folderPath) || !fs.lstatSync(folderPath).isDirectory()) {
            console.error(`Folder "${folder}" does NOT exist at ${folderPath}\n+creating ${folderPath}`);
            fs.mkdirSync(folderPath, { recursive: true });
            continue;
        }
        console.log(`Folder "${folder}" exists at ${folderPath}`);
    }
}