// Neste módulo é utilizado o modulo gdrive-auth.js para autenticação
// e depois envia um arquivo (nesse caso XML) como argumento para o google drive

const fs = require("fs");
const { google } = require('googleapis');

function xmlUpload(fileName, filePath, callback){
    require("./gdrive-auth")((auth) => {
        const fileMetadata = {
            name: fileName
        };

        const media = {
            mimeType: "application/xml",
            body: fs.createReadStream(filePath)
        }
        
        const drive = google.drive({version: 'v3', auth});
        drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
          }, function (err, file) {
            if (err) {
              // Handle error
              console.error(err);
            } else {
              callback(file.data.id);
            }
          });
    });
}

module.exports = { xmlUpload };