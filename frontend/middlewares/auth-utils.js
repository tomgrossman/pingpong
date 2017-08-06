'use strict';

const session           = require('express-session');
const MongoStore        = require('connect-mongo')(session);

const DataDb            = require('./../helpers/db-helper');

exports.GetSessionOptions = function (IsSecure) {
    return {
        secret				: 'd0ad9e6c26a5bd4d278af5a1ee5efbd24551f130b008dcb6d8c73c0756922a607a29ccce9701a119bb6',
        //	Forces session to be saved even when unmodified
        resave				: false,
        rolling             : true,
        //	Forces session to be saved even when unmodified
        saveUninitialized	: true,
        //	Controls result of unsetting req.session (through delete, setting to null)
        unset				: 'destroy',
        cookie: {
            path: '/',
            proxy: IsSecure,
            secure: IsSecure,
            httpOnly: true
        },
        store: new MongoStore({
            mongooseConnection: DataDb.connection,
            ttl: 12 * 60 * 60 //12 hours
        })
    };
};