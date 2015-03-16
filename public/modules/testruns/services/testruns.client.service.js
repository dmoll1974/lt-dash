'use strict';

//Events service used to communicate Events REST endpoints
angular.module('events').factory('TestRuns', ['$http', 'Products', 'Dashboards',
    function($http, Products, Dashboards) {

        var TestRuns = {
//            'get' : getFn,
            selected: {},
            listTestRunsForDashboard: listTestRunsForDashboard

        };

        return TestRuns;

        function listTestRunsForDashboard(productName, dashboardName){

            return $http.get('/testruns-dashboard/' + productName + '/' + dashboardName);

        };


    }
]);
