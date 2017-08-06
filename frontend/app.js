'use strict';

const express       = require('express');
const bodyParser    = require('body-parser');
const session       = require('express-session');

const AuthUtils     = require('./middlewares/auth-utils');
const LoginRoute    = require('./routes/login');
const RegisterRoute = require('./routes/register');
const TableRoute    = require('./routes/table');

const appServer = express();

const LIMIT = '6mb';

//	For Parsing application/json
appServer.use(
    bodyParser.json(
        {
            limit: LIMIT
        }
    )
);

//	For Parsing application/x-www-form-urlencoded
appServer.use(
    bodyParser.urlencoded(
        {
            limit: LIMIT,
            extended: true
        }
    )
);

appServer.use(session(AuthUtils.GetSessionOptions(false)));

appServer.use(
    '/login',
    LoginRoute
);

appServer.use(
    '/register',
    RegisterRoute
);

appServer.use(
    '/table',
    TableRoute
);

appServer.listen(
    3333,
    '0.0.0.0',
    function () {
        console.log(new Date() + ' Listening on port 3333');
    }
);