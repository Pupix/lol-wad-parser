const hashTable  = require('./hashes.json');
const signatures = require('./signatures.json');

module.exports = function (data, cb) {

    data.fileHeaders.forEach((file) => {
        file.fileName = hashTable[file.pathHash] || null;
    });

    cb(null, data.fileHeaders);
};
