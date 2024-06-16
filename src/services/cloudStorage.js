const {Storage} = require('@google-cloud/storage')
const path = require('path');

const serviceAccountKeyPath = path.join(__dirname, '..', '..', 'key', 'cloudStorageServiceAccountKey.json');

const cloudStorage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: serviceAccountKeyPath,
});

module.exports = cloudStorage;