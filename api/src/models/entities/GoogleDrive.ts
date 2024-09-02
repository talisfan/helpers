import { readFileSync, writeFileSync, readFile, createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const CONFIG_PATH = resolve(__dirname, '../config/client_secret.apps.googleusercontent.com.json')
const TOKEN_PATH = resolve(__dirname, '../config/token_gdrive.json');
const redirect_uri = `http://localhost:${process.env.PORT || 3001}`;

class GoogleDrive {
    async updateAccessToken(code, oAuth2Client){
        if(!oAuth2Client){
            const content = readFileSync(CONFIG_PATH, { encoding: 'utf8' });
            const credentials = JSON.parse(content);
            const { client_secret, client_id } = credentials.web;
            oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
        }

        const newToken = await oAuth2Client.getToken(code);
        writeFileSync(TOKEN_PATH, JSON.stringify(newToken.tokens))
        oAuth2Client.setCredentials(newToken);
        return oAuth2Client;
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    #getAccessToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            this.updateAccessToken(code, oAuth2Client)
            .then(newOAuth2Client =>{
                callback(newOAuth2Client);
            })
            .catch(error => console.error(error));
        });
    }

    callGDriveApi(callback) {
        readFile(CONFIG_PATH, (err, content) => {
            if (err)
                return console.error('Error loading client secret file:', err);

            const credentials = JSON.parse(content.toString());
            const { client_secret, client_id } = credentials.web;
            const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

            // Check if we have previously stored a token.
            readFile(TOKEN_PATH, (err, token) => {
                if (err) return this.#getAccessToken(oAuth2Client, callback);
                oAuth2Client.setCredentials(JSON.parse(token.toString()));

                if (callback)
                    callback(oAuth2Client);
                else
                    this.listFiles();
            });
        });
    }

    async isValidCredentials() {
        const content = readFileSync(CONFIG_PATH, { encoding: 'utf8' });
        const credentials = JSON.parse(content);
        const { client_secret, client_id } = credentials.web;

        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
        let token: any = readFileSync(TOKEN_PATH, { encoding: 'utf8' });
        token = JSON.parse(token);
        oAuth2Client.setCredentials(token);

        try {
            await oAuth2Client.getTokenInfo(token['access_token']);
            return true;
        } catch (error) {
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES,
            });
            return {authUrl, redirect_uri};
        }
    }

    uploadFile(fileName, filePath) {
        return new Promise((resolve, reject) => {
            this.callGDriveApi((auth) => {
                const fileMetadata = {
                    name: fileName
                };

                const media = {
                    mimeType: "application/xml",
                    body: createReadStream(filePath)
                }

                const drive = google.drive({ version: 'v3', auth });
                drive.files.create({
                    requestBody: fileMetadata,
                    media: media,
                    fields: 'id'
                }, function (err, file) {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve(file.data.id);
                    }
                });
            });
        });
    }

    /**
     * Lists the names and IDs of up to 10 files.
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    listFiles(query = undefined) {
        return new Promise((resolve, reject) => {
            this.callGDriveApi((auth) => {
                const drive = google.drive({ version: 'v3', auth });
                drive.files.list({
                    pageSize: 10,
                    fields: 'nextPageToken, files(id, name, mimeType)',
                    'q': query
                }, (err, res) => {
                    if (err)
                        return reject('The API returned an error: ' + err);


                    const files = res.data.files;
                    return resolve(files);
                });
            })
        })
    }

    getFileData(fileId, mimeType) {
        return new Promise((resolve, reject) => {
            this.callGDriveApi(async (auth) => {
                const drive = google.drive({ version: 'v3', auth });
                const arq = await drive.files.export({ fileId, alt: 'media', mimeType }, { responseType: 'stream' });
                return resolve(arq);
            })
        })
    }
}

export default GoogleDrive;