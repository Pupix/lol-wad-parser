(function () {
    'use strict';

    // Vars
    var parsers = require('./parsers');

    /*********************************************************************/

    module.exports = function (parser, cb) {

        var wad = {
                header: {}
            };

        wad.header.magic = parser.string(2);
        wad.header.verMajor = parser.ubyte();
        wad.header.verMinor = parser.ubyte();

        parsers['v' + wad.header.verMajor](wad, parser);

        cb(null, wad);

    };

}());
