'use strict';

exports.Teams = [
    'frontend',
    'backend',
    'analysts',
    'product'
];

exports.MatchTypes = {
    friendly: 'friendly',
    weekly_tournament: 'weekly_tournament',
    monthly_tournament: 'monthly_tournament'
};

exports.MatchStatus = {
    new: 'new',
    invited: 'invited',
    accepted: 'accepted',
    played: 'played',
    score_assigned: 'score_assigned'
};