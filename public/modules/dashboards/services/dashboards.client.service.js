'use strict';

//Dashboards service used to communicate Dashboards REST endpoints
angular.module('dashboards').factory('Dashboards', ['$http',
	function($http) {

        var Dashboards = {
//            items : [],
            'get' : getFn,
            selected: '',
            tags: tags,
//            query : query,
//            fetch : fetch,
            create: create

        };

        return Dashboards;

        function tags(){
            
            var arrayOfTagObjects = [];
            
            _.each(Dashboards.selected.tags, function(tag){

                arrayOfTagObjects.push({text: tag})
                
            })
            return arrayOfTagObjects

        }

        function create(dashboard, productName){
            return $http.post('/dashboards/' + productName, dashboard).success(function(dashboard){

            });
        }

        function getFn(productName, dashboardName){
            return $http.get('/dashboards/' + productName + '/' + dashboardName).success(function(dashboard){

                Dashboards.selected = dashboard;
            });
        }



//		return $resource('dashboards/:dashboardId', { dashboardId: '@_id'
//		}, {
//			update: {
//				method: 'PUT'
//			}
//		});
	}
]);