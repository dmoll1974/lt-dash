'use strict';

//Events service used to communicate Events REST endpoints
angular.module('events').factory('TestRuns', ['$http', 'Products', 'Dashboards','Events',
    function($http, Products, Dashboards, Events) {

        var TestRuns = {
//            'get' : getFn,
            selected: {},
            listTestRunsForDashboard: listTestRunsForDashboard,
            zoomFrom: '',
            zoomUntil: '',
            getTestRunById: getTestRunById

        };

        return TestRuns;

        function getTestRunById(productName, dashboardName, testRunId){

            return $http.get('/testrun/' + productName + '/' + dashboardName + '/' + testRunId);//.success(function(testRun){
            //
            //    TestRuns.selected = testRun[0];
            //
            //});

        }

        function listTestRunsForDashboard(productName, dashboardName){

            return $http.get('/testruns-dashboard/' + productName + '/' + dashboardName);

        };


    }
]);
