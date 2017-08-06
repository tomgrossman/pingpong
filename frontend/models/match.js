'use strict';

const Db        = require('./../helpers/db-helper');
const Schema    = Db.mongoose.Schema;

const MatchSchema = new Schema(
    {
        type: String,
        inviter: Schema.Types.ObjectId,
        invitee: Schema.Types.ObjectId,
        invited_at: Date,
        played_at: Date,
        status: String,
        score: {
            winner: Schema.Types.ObjectId,
            added_score: Schema.Types.ObjectId,
            added_at: Date,
            accepted: Boolean,
            accepted_at: Date
        }
    },
    {collection: 'matches'}
);

module.exports = Db.connection.model('match', DeviceSchema);