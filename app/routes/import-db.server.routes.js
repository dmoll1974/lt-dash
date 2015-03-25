'use strict';

module.exports = function(app) {
    var importDb = require('../../app/controllers/import-db.server.controller');
    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart();

    // Events Routes
    //app.route('/import-db')
    //    .get(importDb.dbImport);

    app.route('/upload')
        .post(multipartMiddleware, importDb.upload);


};
