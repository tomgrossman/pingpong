'use strict';

const express   = require('express');

const Auth      = require('./../middlewares/authentication');
const UserModel = require('./../models/user');

const UserRoute = express.Router();

UserRoute.use(Auth.IsPasswordAuthenticatedUser);

UserRoute.get(
    '/get-user-details',
    GetUserDetails
);

function GetUserDetails (Request, Response) {
    let userId  = Request.session.user._id;
    let responseJson = {
        Success: false,
        Data: null
    };

    return UserModel.findById(userId).then(
        (ResultTable) => {
            responseJson.Data = ResultTable;
            responseJson.Success = true;

            return true;
        }
    ).catch(
        (ErrorInst) => {
            responseJson.Data = ErrorInst.stack;
            responseJson.Success = true;

            return false;
        }
    ).finally(
        () => {
            return Response.json(responseJson);
        }
    )
}

module.exports = UserRoute;