const fs = require('fs');
const aws = require('aws-sdk');
const path = require('path');

const ID = 'AKIA6JBEMH2XTTBXLOWE';
const SECRET = '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';
const BUCKET_NAME = 'samsung-xml-google-shopping';

const s3 = new aws.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

async function upload (fileName) {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: 'xmlProducts.xml', // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

upload(path.join(__dirname, "teste.xml"));