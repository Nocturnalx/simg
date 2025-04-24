class InvalidAPIKeyError extends Error{
    constructor(message) {
        super(message);
        this.name = "InvalidAPIKeyError";

        this.status = 403;
        this.response = "Invalid api key";
        this.errCode = "INVKEY";
        this.silent = true;
    }
}

class InvalidFolderError extends Error{
    constructor(message) {
        super(message);
        this.name = "InvalidFolderError";
        
        this.status = 400;
        this.response = "Invalid folder name";
        this.errCode = "INVFLDR";
        this.silent = true;
    }
}

class InvalidFilenameError extends Error{
    constructor(message) {
        super(message);
        this.name = "InvalidFilenameError";

        this.status = 400;
        this.response = "Invalid file name";
        this.errCode = "INVNAME";
        this.silent = true;
    }
}

class FileNotFoundError extends Error{
    constructor(message) {
        super(message);
        this.name = "FileNotFoundError";

        this.status = 404;
        this.response = "File not found";
        this.errCode = "FNF";
        this.silent = true;
    }
}


module.exports = {
    InvalidAPIKeyError,
    InvalidFolderError,
    InvalidFilenameError,
    FileNotFoundError
}