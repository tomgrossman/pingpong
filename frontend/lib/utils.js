const Promise   = require('bluebird');
const Bcrypt    = Promise.promisifyAll(require('bcrypt-nodejs'));

exports.EncryptPassword = function (OrigPass) {
    return Bcrypt.genSaltAsync(10).then(
        (Salt) => {
            return Bcrypt.hashAsync(OrigPass, Salt, null);
        }
    );
};