'use strict';

angular.module('dashboards').controller('DashboardTagsController', ['$scope', 'Dashboards', '$modal', 'Metrics',
	function($scope, Dashboards, $modal, Metrics	) {


		$scope.tags = Dashboards.selected.tags;

		$scope.defaultTag = Dashboards.defaultTag;

		$scope.$watch(function(scope) { return Dashboards.selected },
			function(newVal, oldVal) {

				if (newVal !== oldVal) {

					$scope.tags = Dashboards.selected.tags;

					$scope.defaultTag = Dashboards.getDefaultTag(Dashboards.selected.tags);

					setDefault($scope.defaultTag);

					Dashboards.update().success(function(dashboard){

						$scope.tags = dashboard.tags;
					})
				}
			}
		);

		$scope.$watch('defaultTag', function (newVal, oldVal) {

			if (newVal !== oldVal) {

				setDefault($scope.defaultTag);

				Dashboards.update().success(function(dashboard){

					Dashboards.selected = dashboard;

					$scope.tags = Dashboards.selected.tags;


				})
			}
		});

		function setDefault(newDefaultTag) {

			_.each(Dashboards.selected.tags, function(tag, i){

				if(tag.text === newDefaultTag){
					Dashboards.selected.tags[i].default = true;
				}else{
					Dashboards.selected.tags[i].default = false;
				}
			})
		}


	$scope.openDeleteTagModal = function (size, index) {



		var modalInstance = $modal.open({
			templateUrl: 'deleteTag.html',
			controller: 'DeleteTagModalInstanceCtrl',
			size: size,
			resolve: {
				selectedIndex: function(){
					return index;
				},
				selectedTag: function(){
					return $scope.tags[index].text;
				}
			}
		});

		modalInstance.result.then(function (selectedIndex) {

			var selectedTagsText = Dashboards.selected.tags[selectedIndex].text;

			Dashboards.selected.tags.splice(selectedIndex,1);

			Dashboards.update().success(function(dashboard){

				$scope.tags = dashboard.tags;

				_.each(Dashboards.selected.metrics, function (metric){

					Metrics.removeTag(metric._id, selectedTagsText);

				})
			});


		}, function () {
			//$log.info('Modal dismissed at: ' + new Date());
		});
	};

}
]).controller('DeleteTagModalInstanceCtrl',['$scope','$modalInstance', 'selectedIndex', 'selectedTag', function($scope, $modalInstance, selectedIndex, selectedTag) {

	$scope.selectedTag = selectedTag;

	$scope.ok = function () {
		$modalInstance.close(selectedIndex);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

}

]);
