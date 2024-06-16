const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

const serviceAccountKeyPath = path.join(__dirname, '..', '..', 'key', 'firestoreServiceAccountKey.json');

const firestore = new Firestore({
  projectId: process.env.PROJECT_ID,
  keyFilename: serviceAccountKeyPath,
});

module.exports = firestore;