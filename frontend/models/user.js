'use strict';

const Db        = require('./../helpers/db-helper');
const Schema    = Db.mongoose.Schema;

const Lib       = require('./../lib');

const UserShchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            validate: {
                validator: function (val) {
                    return Lib.validators.IsValidEmail(val);
                },
                message: 'Invalid email address'
            },
            toLower: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        full_name: {
            type: String,
            required: true
        },
        team: {
            type: String,
            required: true
        },
        points: {
            type: Number,
            required: true,
            default: 0
        }
    },
    {
        collection: 'users'
    }
);

module.exports = Db.connection.model('user', UserShchema);