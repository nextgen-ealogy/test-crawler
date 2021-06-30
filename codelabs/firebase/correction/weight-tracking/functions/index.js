const functions = require('firebase-functions');

exports.onCreateDocument = functions.firestore.document("/weight/{referentId}").onWrite((change) => {
    const weight = change.after.data().weight;
    return change.after.ref.set({
        weight_pounds: parseInt(weight) * 2.205
    }, { merge: true})
})