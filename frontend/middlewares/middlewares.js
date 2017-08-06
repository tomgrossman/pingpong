'use strict';

const Lib   = require('./../lib');

exports.FixSessionData = function (Request, Response, Next) {
    if (Request.session && Request.session.user) {
        Request.session.user._id = Lib.utils.ObjectId(Request.session.user._id);
    }

    Next();
};