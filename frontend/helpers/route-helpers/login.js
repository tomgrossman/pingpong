'use strict';

const Lib       = require('./../../lib');
const UserModel = require('./../../models/user');

exports.LoginVerification = function (UserEmail, Password) {
    let userObject = null;

    return UserModel.findOne({email: UserEmail}).lean().exec().then(
        (ResultUser) => {
            userObject = ResultUser;

            return Lib.utils.ComparePassword(userObject.password, Password);
        }
    ).then(
        (CompareResult) => {
            if (!CompareResult) {
                throw new Error('Wrong credentials');
            }

            return userObject;
        }
    );
};