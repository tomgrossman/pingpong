'use strict';

const validator     = require('validator');
const Utils         = require('./utils');

exports.IsValidEmail = validator.isEmail;

const IsObjectIdInstance = exports.IsObjectIdInstance = function (Value) {
    return (Value instanceof Utils.ObjectId);
};

exports.IsValidObjectId = function (Value) {
    if (IsObjectIdInstance(Value)) {
        return true;
    }
    if ('string' === typeof Value && 24 === Value.length) {
        return Utils.ObjectId.isValid(Value);
    } else {
        return false;
    }
};

const IsPropertyOfEnum = exports.IsPropertyOfEnum = function (Value, Enum) {
    for (let key in Enum) {
        if (Enum.hasOwnProperty(key) && Value === Enum[key]) {
            return true;
        }
    }

    return false;
};

const IsFunction = exports.IsFunction = function (Value) {
    let getType = {};

    return Value && '[object Function]' === getType.toString.call(Value);
};

const IsObject = exports.IsObject = function (Value) {
    let getType = {};

    return Value && '[object Object]' === getType.toString.call(Value);
};

exports.IsValidPropertyValue = function (Value, Validator) {
    // Only check properties with required types
    if (null !== Validator && undefined !== Validator) {
        // Check function types
        if (IsFunction(Validator)) {
            if (!Validator(Value)) {
                return false;
            }
            // Check object types
        } else if (IsObject(Validator)) {
            if (!IsPropertyOfEnum(Value, Validator)) {

                return false;
            }

            // Check array type
        } else if (Array.isArray(Validator)) {
            if (!Array.isArray(Value) || 0 >= Value.length) {
                return false;
            }
            for (let i = 0; i < Value.length; i++) {
                if (!IsValidPropertyValue(Value[i], Validator[0])) {
                    return false;
                }
            }
            // Check typeof
        } else if ('string' === typeof Validator) {
            if (Validator !== typeof Value) {

                return false;
            }

            if ('string' === Validator) {
                if ('' === Value.trim()) {
                    return false;
                }
            }
        }
    }

    return true;
};

exports.IsValidPassword = function (Value) {
    let hasLowerCase    = /[a-z]/;
    let hasUpperCase    = /[A-Z]/;
    let hasDigit        = /[0-9]/;
    let hasSpecialChars = /[\!\@\#\$\%\^\&\*\(\)\`\']/;
    let password        = /^[a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\`\']{8,20}$/;

    return (hasLowerCase.test(Value) &&
        hasUpperCase.test(Value) &&
        hasDigit.test(Value) &&
        hasSpecialChars.test(Value) &&
        password.test(Value));
};

exports.IsValidString = function (Value) {
    let regex = /^[A-Za-z0-9!@#\$%:\^'",~&\*\?\)\(\+=\._\-\s\\\/]*[A-Za-z0-9][A-Za-z0-9!@#\$%:\^'",~&\*\?\)\(\+=\._\-\s\\\/]*$/;

    return (null !== Value && regex.test(Value));
};