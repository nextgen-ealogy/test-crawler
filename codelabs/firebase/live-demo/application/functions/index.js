const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.convertWeight = functions.firestore.document("/weights/{weightId}").onWrite(change => {
    const data = change.after.data();
    return change.after.ref.set({
        weight_pounds: data.weight * 2
    }, { merge: true})
})