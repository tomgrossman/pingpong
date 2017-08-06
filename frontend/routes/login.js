'use strict';

const express	    = require('express');
const path          = require ('path');
const serveStatic   = require('serve-static');

const Lib               = require('./../lib');
const Auth              = require('./../middlewares/authentication');
const ReqValidator      = require('./../middlewares/request-validator');
const SessionHelper     = require('./../helpers/session-helper');
const UserModel         = require('./../models/user');

const LoginRoute = express.Router();

LoginRoute.use(Auth.IsUnAuthenticatedUser);

LoginRoute.use(
    '/',
    serveStatic(path.join(__dirname, '../public/login/'))
);

LoginRoute.post(
    '/',
    ReqValidator({
        email       : Lib.validators.IsValidEmail,
        password    : 'string'
    }),
    LoginVerification
);

function LoginVerification (Request, Response) {
    let email           = Request.body.email;
    let password        = Request.body.password;
    let responseJson    = {
        Success : false,
        Data    : null
    };

    return VerifyLogin(email, password).then(
        (ResultUser) => {
            SessionHelper.SaveSessionDetails(Request, ResultUser);
            responseJson.Success = true;

            return true;
        }
    ).catch(
        (ErrorInstance) => {
            responseJson.Success = false;
            responseJson.Data = ErrorInstance.message;

            return false;
        }
    ).finally(
        () => {
            Response.json(responseJson);
        }
    );
}

function VerifyLogin (UserEmail, Password) {
    let userObject = null;

    return UserModel.findOne({email: UserEmail}).lean().exec().then(
        (ResultUser) => {
            userObject = ResultUser;

            return Lib.utils.ComparePassword(userObject.password, Password);
        }
    ).then(
        (CompareResult) => {
            if (!CompareResult) {
                throw new Error('Wrong credentials');
            }

            return userObject;
        }
    );
}

module.exports = LoginRoute;