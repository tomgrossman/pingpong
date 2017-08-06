'use strict';

const express = require('express');

const LogoutRoute = express.Router();

LogoutRoute.use(
    '/',
    function (Request, Response) {
        Request.session.destroy(function () {
            Response.clearCookie('connect.sid', { path: '/' });
            Response.redirect('/login/');
        });
    }
);

module.exports = LogoutRoute;