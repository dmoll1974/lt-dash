'use strict';

angular.module('graphs').controller('TagFilterModalInstanceController', ['$scope', '$modalInstance','ConfirmModal', 'Dashboards',
	function($scope, $modalInstance, ConfirmModal, Dashboards) {

		$scope.loadTags = function(query){

			var matchedTags = [];

			_.each(Dashboards.selected.tags, function(tag){

				if(tag.text.toLowerCase().match(query.toLowerCase()))
					matchedTags.push(tag);
			});

			return matchedTags;

		};


		$scope.filterOperator = ConfirmModal.filterOperator;
		$scope.persistTag = ConfirmModal.persistTag;
		$scope.filterTags = ConfirmModal.filterTags;

		$scope.ok = function () {
			$modalInstance.close($scope.filterTags, $scope.filterOperator, $scope.persistTag);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

	}
]);
