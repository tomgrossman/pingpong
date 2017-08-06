'use strict';

const validators = require('./../lib').validators;

module.exports = function (ReqFields, Options) {
    let errCode         = 200;
    let location        = 'body';
    let missingError    = 'Missing';
    let invalidError    = 'Invalid';
    let responseJson    = {
        Success : false,
        Data    : null
    };

    if (Options) {
        errCode = (Options.ErrCode && 'number' === typeof Options.ErrCode) ? Options.ErrCode : errCode;
        location = (Options.Location && -1 < ['body', 'params', 'query'].indexOf(Options.Location)) ? Options.Location : location;
    }

    return function (Request, Response, Next) {
        for (let prop in ReqFields) {
            let isPropRequired = true;
            let propValidator = ReqFields[prop];

            if (isRequiredObject(propValidator)) {
                isPropRequired = propValidator.Required;
                propValidator = propValidator.Validator;
            }

            // Check if the property exists
            if (!Request[location].hasOwnProperty(prop)) {
                if (false === isPropRequired) {
                    continue;
                }

                responseJson.Data = missingError + prop;

                return (200 !== errCode) ? Response.status(errCode).end(responseJson.Data) : Response.json(responseJson);
            }

            if (!validators.IsValidPropertyValue(Request[location][prop], propValidator)) {
                responseJson.Data = invalidError + prop;

                return (200 !== errCode) ? Response.status(errCode).end(responseJson.Data) : Response.json(responseJson);
            }
        }

        Next();
    };

    function isRequiredObject (obj) {
        if (validators.IsObject(obj) && obj.hasOwnProperty('Validator')
            && obj.hasOwnProperty('Required') && 'boolean' === typeof obj.Required) {
            return true;
        } else {
            return false;
        }
    }
};