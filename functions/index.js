const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.welcomeUser = functions.auth.user().onCreate(async (user) => {
  return new Promise((resolve, reject) => {
    console.log(`Bienvenido ${user.displayName}!`);
    resolve(true);
  });
});

exports.goodbyeUser = functions.auth.user().onDelete(async (user) => {
  return new Promise((resolve, reject) => {
    console.log(`Adios, que lastima que te vayas ${user.displayName}!`);
    resolve(true);
  });
});
