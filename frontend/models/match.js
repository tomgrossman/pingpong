'use strict';

const Db        = require('./../helpers/db-helper');
const Schema    = Db.mongoose.Schema;

const Lib       = require('./../lib');

const MatchSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            enum: Lib.utils.JsonToArray(Lib.enums.MatchTypes)
        },
        inviter: {
            type: Schema.Types.ObjectId,
            required: true
        },
        invitee: {
            type: Schema.Types.ObjectId,
            required: true
        },
        invited_at: {
            type: Date,
            required: true,
            default: new Date()
        },
        played_at: {
            type: Date,
            required: false
        },
        status: {
            type: String,
            required: true,
            enum: Lib.utils.JsonToArray(Lib.enums.MatchStatus),
            default: Lib.enums.MatchStatus.new
        },
        score: {
            winner: Schema.Types.ObjectId,
            score_added_by_user: Schema.Types.ObjectId,
            added_at: Date,
            accepted: Boolean,
            accepted_at: Date
        }
    },
    {
        collection: 'matches',
        versionKey: false,
        minimize: false
    }
);

MatchSchema.statics.GetOpenMatchesByUserId = function (UserId) {
    return this.find(
        {
            $or: [
                {inviter: UserId},
                {invitee: UserId}
            ],
            status: {
                $in: [
                    Lib.enums.MatchStatus.accepted,
                    Lib.enums.MatchStatus.new_tournament
                ]
            }
        }
    ).lean().exec();
};

module.exports = Db.connection.model('match', MatchSchema);