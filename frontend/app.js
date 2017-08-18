'use strict';

const express       = require('express');
const bodyParser    = require('body-parser');
const session       = require('express-session');
const path          = require('path');
const serveStatic   = require('serve-static');

const AuthUtils     = require('./middlewares/auth-utils');
const LoginRoute    = require('./routes/login');
const LogoutRoute   = require('./routes/logout');
const RegisterRoute = require('./routes/register');
const TableRoute    = require('./routes/table');
const MatchesRoute  = require('./routes/matches');
const UserRoute     = require('./routes/user');
const TournamentRoute     = require('./routes/tournament');

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

appServer.use('/node_modules',
    serveStatic(path.join(__dirname, 'node_modules'))
);

appServer.use('/img',
    serveStatic(path.join(__dirname, 'public/static/img/'))
);

appServer.use('/css',
    serveStatic(path.join(__dirname, 'public/dist/css/'))
);

appServer.use('/html',
    serveStatic(path.join(__dirname, 'public/'))
);

appServer.use('/static',
    serveStatic(path.join(__dirname, 'public/static'))
);

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
    '/user',
    UserRoute
);

appServer.use(
    '/tournament',
    TournamentRoute
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