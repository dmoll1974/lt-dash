'use strict';

// Events controller
angular.module('events').controller('EventsController', ['$scope', '$stateParams', '$state', '$location', 'Authentication', 'Events',
	function($scope, $stateParams, $state, $location, Authentication, Events) {
		$scope.authentication = Authentication;

        $scope.productName = $stateParams.productName;

        $scope.dashboardName = $stateParams.dashboardName;

        $scope.event = Events.selected;

        $scope.cancel = function() {

            if ($rootScope.previousStateParams)
                $state.go($rootScope.previousState,$rootScope.previousStateParams);
            else
                $state.go($rootScope.previousState);

        }

        // Open create event form
        $scope.addEventForDashboard = function(){
            
            $scope.event.eventTimestamp = new Date();
            $scope.event.productName = $scope.productName;
            $scope.event.dashboardName = $scope.dashboardName;
            
            $state.go('createEvent');
            
        };
        
        // Create new Event
        $scope.create = function() {

            Events.create($scope.event).success(function (event) {

                $state.go('viewDashboard',{"productName":$stateParams.productName, "dashboardName":dashboard.name});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

        };

        // Remove existing Event
		$scope.remove = function(event) {
			if ( event ) { 
				event.$remove();

				for (var i in $scope.events) {
					if ($scope.events [i] === event) {
						$scope.events.splice(i, 1);
					}
				}
			} else {
				$scope.event.$remove(function() {
					$location.path('events');
				});
			}
		};

		// Update existing Event
		$scope.update = function() {
			var event = $scope.event;

			event.$update(function() {
				$location.path('events/' + event._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

        $scope.listEventsForDashboard = function() {
            
              Events.listEventsForDashboard($scope.productName, $scope.dashboardName).success(function (events){
                  
                  $scope.events = events;
                  
              }, function(errorResponse) {
                  $scope.error = errorResponse.data.message;
              });  
            
        };
        
        $scope.editEvent = function(index){
            
            Events.selected = $scope.events[index];

            $state.go('editEvent',{"productName":$stateParams.productName, "dashboardName":$stateParams.dashboardName, "eventId" : $scope.event._id });

        };
		// Find a list of Events
		$scope.find = function() {
			$scope.events = Events.query();
		};

		// Find existing Event
		$scope.findOne = function() {
			$scope.event = Events.get({ 
				eventId: $stateParams.eventId
			});
		};
	}
]);