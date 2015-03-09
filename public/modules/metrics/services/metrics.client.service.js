'use strict';

//Metrics service used to communicate Metrics REST endpoints
angular.module('metrics').factory('Metrics', ['$http',
	function($http) {


        var Metrics = {
//            items : [],
//            'get' : getFn,
//            query : query,
//            fetch : fetch,
            create: create

        };

        return Metrics;


        function create(metric){
            return $http.post('/metrics', metric).success(function(metric){

            });
        }

	}
]);