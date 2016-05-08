'use strict';

/**
 * @ngdoc function
 * @name housePickerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the housePickerApp
 */
angular.module('housePickerApp')
  .controller('MainCtrl', function ($log, $q, $scope, User, Houses, $timeout, database, $sessionStorage) {
	var cycling = true,
		cycleCount = 0,
		prevCount = 0,
		delay = 300;
	$scope.houseSelected = User.houseAssigned ? true : false;
	$scope.user = angular.copy(User);
	$scope.houseList = angular.copy(Houses);
	$scope.form= { response: ''};
	$scope.disableButton = true;
	$scope.cycling = User.houseAssigned ? false : true;
	$scope.showWelcome = User.houseAssigned ? true : false;
	$scope.selectedHouse = false;

	if (User.houseAssigned) { 
		angular.forEach($scope.houseList.houses, function (house, idx) {
			$scope.houseList.houses[idx].visible = false;
			if (house.player.name === User.name) {
				console.log('Found the right house.', $scope.houseList.houses[idx]);
				$scope.houseList.houses[idx].visible = true;
				$scope.selectedHouse = angular.copy($scope.houseList.houses[idx]);
				console.log('Selected house: ', $scope.selectedHouse);
			}
		});
	}

	var newCount = function (done) {
		if (prevCount !== 5) {
			cycleCount++;
		} else {
			cycleCount = 0;
		}

		return done(cycleCount);
	};

	var cycleHouses = function () {
		newCount(function (count) {
			$scope.houseList.houses[count].visible = true;
			$scope.houseList.houses[prevCount].visible = false;
		
			prevCount = count;
			if (delay >= 1050 && $scope.houseList.houses[count].player === '') {
				$scope.houseSelected = true;
				$scope.selectedHouse = angular.copy($scope.houseList.houses[count]);
				$log.debug('Assigning ', $scope.houseList.houses[count].name, ' to ', $scope.user.name);

				$timeout.cancel();
				$scope.user.houseAssigned = true;
				$sessionStorage.currentUser = $scope.user;
				database.getHouses(function (houseList) {
					houseList.houses[count].player = $scope.user;
					database.updateHouses(houseList, function (result) {
						console.log('Result of update: ', result);
						//expandLogo($scope.houseList.houses[count]);
					});
				});
				database.getUsers(function (users) {
					angular.forEach(users, function (user, key) {
						if (user.name === $scope.user.name) {
							users[key] = $scope.user;
						}
					});
					database.updateUsers(users, function (result) {
						console.log('REsult of update: ', result);
					});
				});
			} else if (!$scope.houseSelected) {
				
				$timeout(function () {
					if (!cycling) {
						delay += 50;
					}
					cycleHouses();
				}, delay);
			}
		});
	};

	$scope.checkValidity = function () {
		var response = angular.copy($scope.form.response);
		if (response.toLowerCase().replace(' ', '') === 'valardohaeris') {
			$scope.disableButton = false;
		} else {
			$scope.disableButton = true;
		}
	};

	$scope.makeChoice = function () {
		cycling = false;
		$scope.cycling = false;
		$timeout(function (){
			$scope.showWelcome = true;
		}, 500); 
	};

	cycleHouses();
  });
