'use strict';

/**
 * @ngdoc function
 * @name housePickerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the housePickerApp
 */
angular.module('housePickerApp')
  .controller('OverviewCtrl', function (Houses, User, $scope) {
  	$scope.houseList = angular.copy(Houses);
  	$scope.user = angular.copy(User);
  });