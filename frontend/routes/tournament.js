'use strict';

const express   = require('express');

const Lib               = require('./../lib');
const Auth              = require('./../middlewares/authentication');
const TournamentModel   = require('./../models/tournament');
const MatchModel        = require('./../models/match');

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

    return TournamentModel.findOne({active: true}).lean().exec().then(
        (ResultTournament) => {
            return GetActiveTournamentObject(ResultTournament);
        }
    ).then(
        (ResultObject) => {
            responseJson.Data = ResultObject;
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

function GetActiveTournamentObject (OrigObj) {
    if (!OrigObj) {
        return null;
    }

    let newObj = OrigObj;

    let matchIds = [].concat.apply([], OrigObj.stages);

    return MatchModel.find({_id: {$in: matchIds}}).lean().exec().then(
        (ResultMatches) => {
            newObj.stages = newObj.stages.map((currStage) => {
                return currStage.map((currSubStage) => {
                    return ResultMatches.find((currMatch) => {
                        return Lib.utils.IsEqualObjectId(currMatch._id, currSubStage);
                    });
                });
            });

            return newObj;
        }
    )
}

module.exports = UserRoute;