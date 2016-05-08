'use strict';

angular.module('housePickerApp')
.controller('SelectorCtrl', function ($scope, User) {
	$scope.user = angular.copy(User);
});