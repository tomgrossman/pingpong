'use strict';

const Db        = require('./../helpers/db-helper');
const Schema    = Db.mongoose.Schema;

const Lib       = require('./../lib');
const MatchModuleSchema = require('./match').MatchModuleSchema;

const TournamentSchema = new Schema(
    {
        tournament_type: {
            type: String,
            required: true,
            enum: Lib.utils.JsonToArray(Lib.enums.TournamentTypes)
        },
        initial_attendees: [
            {
                //validate: {
                //    validator: function (val) {
                //        return val === null || Lib.validators.IsValidObjectId(val)
                //    },
                //    message  : 'Invalid object id'
                //}
            }
        ],
        stages: [
            [
                {
                    type: Schema.Types.ObjectId
                }
            ]
        ],
        creation_date: {
            type: Date,
            required: true,
        },
        registration_open: {
            type: Boolean,
            required: true,
            default: true
        },
        active: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        collection: 'tournaments',
        versionKey: false
    }
);

TournamentSchema.statics.GetActiveTournament = function () {
    //return this.aggregate(
    //    {
    //        $lookup: {
    //            from        : 'matches',
    //            //localField  : 'SourceID'
    //            foreignField: '_id',
    //            as          : 'SourceDetails'
    //        }
    //    }
    //)
    return this.findOne({active: true, registration_open: false}, {stages: true}).lean().exec();
};

module.exports = Db.connection.model('tournament', TournamentSchema);