const hashTable  = require('../hashes');

module.exports = function (data, cb, parser) {

    data.fileHeaders.forEach((file) => {
        file.fileName = hashTable[file.pathHash] || null;

        if (file.type === 2) {
            try {
                parser.seek(file.offset);
                file.redirectsTo = parser.string(parser.uint());
            } catch (e) {
                console.log(e);
            }
        }
    });

    cb(null, data.fileHeaders);
};
