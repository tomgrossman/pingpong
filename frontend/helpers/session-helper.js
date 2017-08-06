'use strict';

//	Parse user data on request from session data
exports.SaveSessionDetails = function (Request, UserObject) {
    Request.session.user = UserObject;

    return true;
};