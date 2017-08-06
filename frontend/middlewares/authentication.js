'use strict';

exports.IsPasswordAuthenticatedUser = function (Request, Response, Next) {
    let userObject = Request.session.user || {};

    if (userObject.email && userObject.password) {
        Next();
    } else {
        if ('GET' === Request.method) {
            Response.redirect('/login/');
        } else {
            Response.status(400).end();
        }
    }
};