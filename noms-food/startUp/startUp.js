//currently incomplete

const firebase = require('firebase');
require('firebase\firestore');

//to update with testdata we want to test
const {} = require('./testData')

//missing this
var firebaseConfig = {

}

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

function populateCollection(collectionName, testData) {
    return Promise.all(testData.map(item => {
        const {data} = item;
        collectionRef = collection(db, collectionName);
        return db.addDoc(collectionRef, item);
    }))
}

Promise.all([
    populateCollection('dummy', dummy),
])
.then(() => {
    console.log('Done!');
    process.exit(0);
})
.catch(err => {
    console.log(err);
});
