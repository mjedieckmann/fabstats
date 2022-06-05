/**
 * Helper functions
 */
const validationResult = require('express-validator').validationResult;

/**
 * Validate a request with express-validator and return errors, if any.
 */
module.exports.getValidationResult = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let message = '';
        errors.array().forEach((error) => {
            message += error.msg + ' ';
        });
        return {hasErrors: true, message: message};
    } else {
        return {hasErrors: false};
    }
}