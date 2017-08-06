'use strict';

const express       = require('express');

const Lib           = require('./../lib');
const Auth          = require('./../middlewares/authentication');
const ReqValidator  = require('./../middlewares/request-validator');
const ModelUtils    = require('./../models/model-utils');
const UserModel     = require('./../models/user');

const RegisterRoute = express.Router();

RegisterRoute.use(Auth.IsUnAuthenticatedUser);

RegisterRoute.post(
    '/',
    ReqValidator({
        email: Lib.validators.IsValidEmail,
        password: Lib.validators.IsValidPassword,
        reTypePassword: Lib.validators.IsValidPassword,
        full_name: Lib.validators.IsValidString,
        team: Lib.enums.Teams
    }),
    RegisterUser
);

function RegisterUser (Request, Response) {
    let userBody = Request.body;
    let responseJson = {
        Success: false,
        Data: null
    };

    if (userBody.password !== userBody.reTypePassword) {
        responseJson.Data = 'Passwords does not match';

        return Response.json(responseJson);
    }

    let newUserModel = {};

    return Lib.utils.EncryptPassword(userBody.password).then(
        (HashedPassword) => {
            userBody.password = HashedPassword;
            delete userBody.reTypePassword;

            newUserModel = new UserModel(userBody);

            return ModelUtils.HandleMongooseValidation(newUserModel);
        }
    ).then(
        () => {
            return newUserModel.save()
        }
    ).then(
        () => {
            responseJson.Success = true;

            return true;
        }
    ).catch(
        (ErrorInst) => {
            console.log(ErrorInst.message);
            responseJson.Data = ErrorInst.stack;

            return false;
        }
    ).finally(
        () => {
            return Response.json(responseJson);
        }
    )
}

module.exports = RegisterRoute;