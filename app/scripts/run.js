'use strict';

angular.module('housePickerApp')
.run(function ($state, $rootScope, $log, $sessionStorage) {

	$rootScope.$on('$stateChangeSuccess', function (e) {
		//console.log('State: ', $state);
		if ($state.current.name !== 'home' || $state.current.name !== 'theWall') {
			var authorized = $sessionStorage.currentUser ? true : false;

			if (!authorized) {
				e.preventDefault();
				console.log('Not authorized');
				$state.go('theWall');
			}
		}
	});
});