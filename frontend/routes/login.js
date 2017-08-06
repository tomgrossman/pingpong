'use strict';

const express   = require('express');
const path = require ('path');
const serveStatic = require('serve-static');

const LoginRoute = express.Router();

LoginRoute.use(
    '/',
    express.static(path.join(__dirname, '../public/login/'))
);

module.exports = LoginRoute;