"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
admin.initializeApp(functions.config().firebase);
// // Start writing Firebase Functions
// // https://firebase.google.com/functions/write-firebase-functions
//
exports.likeDisLike = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const store = admin.firestore();
        return admin.auth().verifyIdToken(req.query.token)
            .then(function (decodedToken) {
            const uid = decodedToken.uid;
            const value = req.query.value === 'true';
            const userId = req.query.userId;
            const likeRef = store.collection('likes').doc(uid);
            const update = {};
            update[userId] = value;
            Promise.all([
                likeRef.set(update, { merge: true }),
                store.collection('likes').doc(userId).get()
            ]).then(([updated, likes]) => {
                let match = false;
                console.log(value);
                console.log(likes.exists);
                if (value && likes.exists) {
                    const data = likes.data();
                    console.log(data[uid]);
                    if (data[uid] === true) {
                        match = true;
                        Promise.all([
                            store.collection('users').doc(uid).get(),
                            store.collection('users').doc(userId).get(),
                        ]).then(([own, other]) => {
                            store.collection('users')
                                .doc(uid)
                                .collection('matches')
                                .doc(userId)
                                .set(own.data());
                            store.collection('users')
                                .doc(userId)
                                .collection('matches')
                                .doc(uid)
                                .set(other.data());
                        });
                    }
                }
                // do match check
                res.send({
                    match,
                });
            });
        });
    });
});
exports.getMatch = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const store = admin.firestore();
        return admin.auth().verifyIdToken(req.query.token)
            .then(function (decodedToken) {
            const uid = decodedToken.uid;
            Promise.all([
                store.collection('users').get(),
                store.collection('likes').doc(uid).get(),
            ])
                .then(([users, likes]) => {
                let excludes = [uid];
                if (likes.exists) {
                    excludes = excludes.concat(Object.keys(likes.data()));
                }
                const other = [];
                // this loop should stop after one hit
                users.forEach(function (doc) {
                    if (excludes.indexOf(doc.id) > -1) {
                        console.log('excluded', doc.id);
                        return;
                    }
                    other.push(Object.assign({}, doc.data(), { id: doc.id }));
                });
                if (other.length > 0) {
                    res.send(other[0]);
                }
                else {
                    res.sendStatus(404);
                }
            });
        });
    });
});
//# sourceMappingURL=index.js.map