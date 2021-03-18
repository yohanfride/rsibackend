var admin = require("firebase-admin");

var serviceAccount = require(process.env.FIREBASE_JSON_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});

module.exports.admin = admin