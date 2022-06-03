const validationResult = require('express-validator').validationResult;

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