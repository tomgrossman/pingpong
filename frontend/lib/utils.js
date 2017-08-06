const Promise   = require('bluebird');
const Bcrypt    = Promise.promisifyAll(require('bcrypt-nodejs'));

exports.ObjectId = require('mongoose').Types.ObjectId;

exports.EncryptPassword = function (OrigPass) {
    return Bcrypt.genSaltAsync(10).then(
        (Salt) => {
            return Bcrypt.hashAsync(OrigPass, Salt, null);
        }
    );
};

exports.ComparePassword = function (OrigPassword, Password) {
    return Bcrypt.compareAsync(Password, OrigPassword);
};

exports.JsonToArray = function (JsonObject) {
    return Object.keys(JsonObject).map(function (k) {
        return JsonObject[k];
    });
};

exports.IsEqualObjectId = function (OrigObjectId, DestObjectId) {
    if (!OrigObjectId || !DestObjectId) {
        return false;
    }

    let origObjectId = OrigObjectId;
    if ('string' === typeof origObjectId) {
        if (!ObjectId.isValid(origObjectId)) {
            return false;
        }

        origObjectId = new ObjectId(origObjectId);
    }

    let destObjectId = DestObjectId;
    if ('string' === typeof destObjectId) {
        if (!ObjectId.isValid(destObjectId)) {
            return false;
        }

        destObjectId = new ObjectId(destObjectId);
    }

    return (origObjectId.equals(destObjectId));
};
