const functions = require('firebase-functions/lib/index');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.helloWorld = functions.database.ref('/post')
    .onWrite(event => {
        const val = event.data.val();
        console.log('helloWorld', val);
    });
