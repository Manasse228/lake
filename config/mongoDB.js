
const mongoose = require('mongoose');

const userName = "manasse";
const password = "r05d1RBau9Td65Uy";
const database = "lake";
const port = ".mongodb.net/";
const host = "@lake.xd7jvtv";

//mongodb+srv://manasse:<password>@lake.xd7jvtv.mongodb.net/?retryWrites=true&w=majority

const dbUrl = "mongodb+srv://" + userName + ":" + password + host + port + database + "?retryWrites=true&w=majority";

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {})
    .catch(err => console.log("Could not connect", err));
// In order to remove deprecated warning collection.ensureIndex is deprecated. Use createIndexes instead.
//mongoose.set('useCreateIndex', true);

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
//db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log("Connexion à la base OK ");
});

module.exports = db;


