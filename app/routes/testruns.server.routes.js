'use strict';

module.exports = function(app) {

    var testruns = require('../../app/controllers/testruns.server.controller');

    app.route('/testruns-dashboard/:productName/:dashboardName')
        .get(testruns.testRunsForDashboard)

};
