'use strict';

const Promise   = require('bluebird');

exports.HandleMongooseValidation = function (ModelToValidate) {
    return new Promise(function (Resolve, Reject) {
        ModelToValidate.validate((validationError) => {
            if (!validationError) {
                return Resolve(true);
            }

            if (!validationError.errors) {
                if ('string' === typeof validationError) {
                    return Reject(new Error(validationError));
                }

                return Reject(validationError);
            }

            let errorMessage = '';
            for (let prop in validationError.errors) {
                let currError = validationError.errors[prop];
                let path = (currError.path) ? currError.path.substr(currError.path.lastIndexOf('.') + 1) : '';

                switch (currError.kind) {
                    case 'required':
                    case 'min':
                    case 'max':
                    case 'enum':
                        errorMessage = 'Invalid' + path;
                        break;

                    case 'user defined':
                        errorMessage = currError.message;
                        break;

                    default:
                        errorMessage = currError.message;
                }

                return Reject(new Error(errorMessage));
            }

            return Reject(new Error(errorMessage));
        });
    });
};