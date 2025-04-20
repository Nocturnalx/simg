# Simple Image Server
Extremely simple image upload and download server you can use as a self hosted placeholder instead of other more professional image upload servers.

See "example.env" for details on setting up the .env file

Works by defining separate folders you want in the dotenv. These will be auto created if they do not exist already. When uploading to /upload/:folder the file will be placed into that folder so long as it is defined in the dotenv.

See API.md for clarification on how to make requests.
