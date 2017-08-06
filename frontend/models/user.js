'use strict';

const Db        = require('./../helpers/db-helper');
const Schema    = Db.mongoose.Schema;

const UserShchema = new Schema(
    {
        email: String,
        full_name: String,
        team: String,
        points: Number
    },
    {collection: 'users'}
);

module.exports = Db.connection.model('user', DeviceSchema);