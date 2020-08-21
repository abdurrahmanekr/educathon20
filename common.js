const crypto = require('crypto');

module.exports = {
    passwordHash: (pass) => {
        return crypto.pbkdf2Sync(pass, 'salt', 100000, 64, 'sha512').toString('hex');
    },
};
