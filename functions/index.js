const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {schedule} = require("firebase-functions/v1/pubsub");

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

exports.calculateInvoice = functions.firestore
    .document("invoices/{invoiceId}")
    .onCreate(async (snap, context) => {
      console.log("Calculando factura...");
      console.log(snap);

      const invoiceId = context.params.invoiceId;
      const total = snap.data().total;
      const taxes = snap.data().taxes;

      const totalInvoice = total + taxes;

      const firestore = admin.firestore();

      return firestore.doc(`invoices/${invoiceId}`).set(
          {
            totalInvoice: totalInvoice,
          },
          {
            merge: true,
          }).then(() => {});
    });

exports.updateInvoice = functions.firestore
    .document("invoices/{invoiceId}")
    .onUpdate(async (change, context) => {
      const invoiceId = context.params.invoiceId;
      const firestore = admin.firestore();

      return firestore.doc(`invoices/${invoiceId}`).update(
          {
            finished: true,
          },
      ).then(() => {});
    });

exports.deleteInvoice = functions.firestore
    .document("invoices/{invoiceId}")
    .onDelete(async (snap, context) => {
      const bitacoraId = context.params.invoiceId;
      const firestore = admin.firestore();

      return firestore.doc(`bitacora/${bitacoraId}`).set(
          {
            message: "Se ha eliminado una factura",
            date: new Date(),
          },
      ).then(() => {});
    });

exports.timerUpdate = functions.pubsub
    .schedule("* * * * *")
    .onRun((context) => {
      return new Promise((resolve, reject) => {
        console.log("Timer ejecutado");
        resolve(true);
      });
    });
