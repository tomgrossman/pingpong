'use strict';

const express       = require('express');

const Lib           = require('./../lib');
const Auth          = require('./../middlewares/authentication');
const ReqValidator  = require('./../middlewares/request-validator');
const ModelUtils    = require('./../models/model-utils');
const MatchModel    = require('./../models/match');

const TableRoute = express.Router();

TableRoute.use(Auth.IsPasswordAuthenticatedUser);

TableRoute.post(
    '/add-friendly-match/:UserID([A-Fa-f0-9]{24})',
    AddFriendlyMatch
);

TableRoute.post(
    '/add-score/:MatchID([A-Fa-f0-9]{24})',
    ReqValidator({
        winner: Lib.validators.IsValidObjectId
    }),
    AddScoreToMatch
);

function AddFriendlyMatch (Request, Response) {
    let responseJson = {
        Success: false,
        Data: null
    };

    let newMatchModel = new MatchModel({
        type: Lib.enums.MatchTypes.friendly,
        inviter: Request.session.user._id,
        invitee: Lib.utils.ObjectId(Request.params.UserID)
    });

    return ModelUtils.HandleMongooseValidation(newMatchModel).then(
        () => {
            return newMatchModel.save();
        }
    ).then(
        () => {
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

function AddScoreToMatch (Request, Response) {
    let userId  = Request.session.user._id;
    let matchId = Lib.utils.ObjectId(Request.params.MatchID);
    let winner  = Lib.utils.ObjectId(Request.body.winner);
    let responseJson = {
        Success: false,
        Data: null
    };

    return MatchModel.findByIdAndUpdate(matchId, {$set: {
        status: Lib.enums.MatchStatus.played,
        score: {
            winner: winner,
            score_added_by_user: userId,
            added_at: new Date()
        }
    }}).exec().then(
        () => {
            responseJson.Success = true;

            return true;
        }
    ).catch(
        (ErrorInst) => {
            responseJson.Success = false;
            responseJson.Data = ErrorInst.stack;

            return false;
        }
    ).finally(
        () => {
            return Response.json(responseJson);
        }
    )
}

module.exports = TableRoute;