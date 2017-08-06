'use strict';

const express   = require('express');

const Auth      = require('./../middlewares/authentication');
const UserModel = require('./../models/user');

const TableRoute = express.Router();

TableRoute.use(
    Auth.IsPasswordAuthenticatedUser
);

TableRoute.get(
    '/',
    GetTable
);

function GetTable (Request, Response) {
    let responseJson = {
        Success: false,
        Data: null
    };

    return UserModel.GetTableUsers().then(
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

module.exports = TableRoute;