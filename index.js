const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening at ${port}...`);
});

app.use(express.static('public'));

const credentials = require('./credentials.json');

const scopes = [
  'https://www.googleapis.com/auth/drive'
];

const auth = new google.auth.JWT(
  credentials.client_email, null,
  credentials.private_key, scopes
);

const drive = google.drive({ version: "v3", auth });

const dataId = '1LqCuQ9WxTkhenQHmCBTYDp3KXsRD7tpb';
const dataFilename = 'lth-c-d.txt';
const dest = fs.createWriteStream(dataFilename);

drive.files.get({fileId: dataId, alt: 'media'}, {responseType: 'stream'},
  function(err, res) {
    res.data.on('end', () => {
      console.log('Done.');
    }).on('error', err => {
      console.log('Error.', err);
    }).pipe(dest);
  }
);

app.get('/heatmap', (req, res) => {
  fs.readFile(dataFilename, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    res.json(data);
  });
});