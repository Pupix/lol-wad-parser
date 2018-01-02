const requireDirectory = require('require-directory');

const exp = {};
const options = {
    visit(object) {
        Object.assign(exp, object);
    }
};

requireDirectory(module, options);

module.exports = exp;
