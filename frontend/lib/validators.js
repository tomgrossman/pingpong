'use strict';

const validator     = require('validator');

exports.IsValidEmail = validator.isEmail;

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