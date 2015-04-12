(function() {
    'use strict';

    /* public/modules/graphs/directives/gatling-details.client.directive.js */

    /**
     * @desc
     * @example <div requirements></div>
     */
    angular
        .module('graphs')
        .directive(
        'requirements', RequirementsDirective)

    function RequirementsDirective() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'modules/graphs/views/requirements-directive.client.view.html',
            controller: RequirementsController,
            controllerAs: 'vm'
        };

        return directive;

        /* @ngInject */
        function RequirementsController (
            $scope,
            $timeout,
            $filter,
            $stateParams,
            TestRuns,
            ngTableParams

        ) {


            TestRuns.getTestRunById($stateParams.productName, $stateParams.dashboardName, $stateParams.testRunId).success(function (testRun) {

                TestRuns.selected = testRun;

                var data = [];

                _.each(testRun.metrics, function(metric){

                    /* only show metrics that fail to meet requirements */
                    if(metric.metricMeetsRequirement === false) {

                        var tag = (metric.tags) ? metric.tags[0].text : 'All';

                        _.each(metric.targets, function (target) {



                            data.push({

                                target: target.target,
                                value: target.value,
                                targetMeetsRequirement: target.targetMeetsRequirement,
                                metric: metric.alias,
                                metricId: metric._id,
                                testRunId: testRun.testRunId,
                                productName: $stateParams.productName,
                                dashboardName: $stateParams.dashboardName,
                                tag: tag

                        });
                        })
                    }
                })


                $scope.tableParams = new ngTableParams({
                    page: 1,            // show first page
                    count: 50          // count per page

                }, {
                    groupBy: 'metric',
                    total: data.length,
                    getData: function($defer, params) {
                        var orderedData = params.sorting() ?
                            $filter('orderBy')(data, $scope.tableParams.orderBy()) :
                            data;

                        $defer.resolve(orderedData);
                    }
                });
            });



        }
    }

    function LoadingContainerDirective (){

        var directive = {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                var loadingLayer = angular.element('<div class="loading"></div>');
                element.append(loadingLayer);
                element.addClass('loading-container');
                scope.$watch(attrs.loadingContainer, function (value) {
                    loadingLayer.toggleClass('ng-hide', !value);
                });
            }
        };

        return directive;

    }
}());
