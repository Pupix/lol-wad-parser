(function () {
    'use strict';

    // Vars
    var hashTable  = require('./hashes.json'),
        signatures = require('./signatures.json');

    /*********************************************************************/

    module.exports = function (data, cb) {

        data.fileHeaders.forEach((file) => {
            file.fileName = hashTable[file.pathHash] || null;
        });

        cb(null, data.fileHeaders);
    };

}());
