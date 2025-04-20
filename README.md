# Simple Image Server
Extremely simple image upload and download server you can use as a self hosted placeholder instead of other more professional image upload servers.

See "example.env" for details on setting up the .env file

Works with specific folders which are defined in the dotenv. These will be auto created if they do not exist already and when uploading to /upload/:folder the file will be placed into that folder so long as it exists.
