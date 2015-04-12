(function() {
    'use strict';

    /* public/modules/testruns/directives/running-test.client.directive.js */

    /**
     * @desc
     * @example <div running-test></div>
     */
    angular
        .module('testruns')
        .directive(
        'runningTest', RunningTestDirective)

    function RunningTestDirective() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'modules/testruns/views/running-test-directive.client.view.html',
            controller: RunningTestController,
            controllerAs: 'vm'
        };

        return directive;

        /* @ngInject */
        function RunningTestController (
            $scope,
            $stateParams,
            TestRuns
        ) {


            TestRuns.getRunningTest($stateParams.productName, $stateParams.dashboardName).success(function (runningTest) {

                $scope.runningTest = runningTest;


            });



        }
    }

}());
