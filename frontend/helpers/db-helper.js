const Promise       = require('bluebird');
const mongoose      = require('mongoose');

const DB_URL = 'mongodb://localhost:27017/ping_pong';//TODO change back to what it was!!!

mongoose.Promise = Promise;
const connectionOptions = {
    promiseLibrary: Promise,
    useMongoClient: true,
    poolSize: 20,
    socketTimeoutMS: 0,
    connectTimeoutMS: 0
};

const DbConnection = mongoose.createConnection(DB_URL, connectionOptions);

module.exports = {
    connection: DbConnection,
    mongoose: mongoose
};