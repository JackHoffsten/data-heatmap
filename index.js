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

async function readData(dataId, res) {
  const request = drive.files.get({
    fileId: dataId,
    alt: 'media'
  });

  request.then((response) => {
    res.json(response.data)
  });
};

app.get('/heatmap', (req, res) => {
  readData(dataId, res);
});