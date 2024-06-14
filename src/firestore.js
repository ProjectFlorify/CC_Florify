const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

const serviceAccountKeyPath = path.join(__dirname, '..', 'key', 'serviceAccountKey.json');

const firestore = new Firestore({
  projectId: 'florify-426403',
  keyFilename: serviceAccountKeyPath,
});

module.exports = firestore;