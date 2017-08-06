'use strict';

const express	        = require('express');

const Lib               = require('./../lib');
const ReqValidator      = require('./../middlewares/request-validator');
const SessionHelper     = require('./../helpers/session-helper');
const LoginHelper       = require('./../helpers/route-helpers/login');

const LoginRoute = express.Router();

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

    return LoginHelper.LoginVerification(email, password).then(
        (ResultUser) => {
            SessionHelper.SaveAgentSessionDetails(Request, ResultUser);
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

module.exports = LoginRoute;