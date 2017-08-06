'use strict';

const express   = require('express');

const Auth      = require('./../middlewares/authentication');
const TournamentModel = require('./../models/tournament');

const UserRoute = express.Router();

UserRoute.use(Auth.IsPasswordAuthenticatedUser);

UserRoute.get(
    '/',
    GetActiveTournament
);

function GetActiveTournament (Request, Response) {
    let responseJson = {
        Success: false,
        Data: null
    };

    return TournamentModel.GetActiveTournament().then(
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