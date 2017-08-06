'use strict';

const express       = require('express');
const bodyParser    = require('body-parser');
const path          = require('path');
const serveStatic   = require('serve-static');
const session       = require('express-session');

const AuthUtils     = require('./middlewares/auth-utils');
const LoginRoute    = require('./routes/login');
const LogoutRoute   = require('./routes/logout');
const RegisterRoute = require('./routes/register');
const TableRoute    = require('./routes/table');
const MatchesRoute  = require('./routes/matches');

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

appServer.use('/node_modules',
    serveStatic(path.join(__dirname, 'node_modules'))
);

appServer.use('/css',
    serveStatic(path.join(__dirname, 'public/'))
);

appServer.use('/static',
    serveStatic(path.join(__dirname, 'public/static'))
);

appServer.use(session(AuthUtils.GetSessionOptions(false)));

appServer.use(
    '/login',
    LoginRoute
);

appServer.use(
    '/logout',
    LogoutRoute
);

appServer.use(
    '/register',
    RegisterRoute
);

appServer.use(
    '/table',
    TableRoute
);

appServer.use(
    '/matches',
    MatchesRoute
);

appServer.use(
    '/',
    TableRoute
);

appServer.listen(
    3333,
    '0.0.0.0',
    function () {
        console.log(new Date() + ' Listening on port 3333');
    }
);