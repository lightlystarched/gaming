'use strict';

angular.module('housePickerApp')
.config(function ($stateProvider, $urlRouterProvider, $logProvider) {
	var states = {},
		resolve = {};

	if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
		$logProvider.debugEnabled(true);
	} else {
		$logProvider.debugEnabled(false);
	}

	resolve = {
		users: ['$q', 'database', '$state', '$stateParams', '$sessionStorage', function ($q, database, $state, $stateParams, $sessionStorage) {
			var authorized = false,
				deferred = $q.defer(),
				currentUser = null;

			database.getUsers(function (users) {
				//console.log('Users: ', users);
				if ($stateParams.key && users[$stateParams.key]) {
					var user = users[$stateParams.key];
					//console.log('User found: ', user);
					$sessionStorage.currentUser = user;
					authorized = true;

					$state.go('selector', {}, {reload: true});
					deferred.resolve(currentUser);
				}

				if (!authorized) { 
					$state.go('theWall');
					return null;
				}
			});

			return deferred.promise;
		}],
		user: ['$q', 'database', '$state', '$stateParams', '$sessionStorage', function ($q, database, $state, $stateParams, $sessionStorage) {
			var deferred = $q.defer();

			deferred.resolve($sessionStorage.currentUser);

			return deferred.promise;
		}],
		houses: ['$q', 'database', function ($q, database) {
			var deferred = $q.defer();

			database.getHouses(function (houses) {
				deferred.resolve(houses);
			});

			return deferred.promise;
		}]
	};

	states = {
		home: {
			name: 'home',
			url: '/?key',
			views: {
				content: { resolve: {
					User: resolve.users
				}}
			}
		},
		selector: {
			name: 'selector',
			url: '/greeting',
			views: {
				content: { controller: 'MainCtrl', templateUrl: 'views/main.html', resolve: {
					User: resolve.user,
					Houses: resolve.houses
				}}
			}
		},
		overview: {
			name: 'overview',
			url: '/overview',
			views: {
				content: { controller: 'OverviewCtrl', templateUrl: 'views/overview.html', resolve: {
					User: resolve.user,
					Houses: resolve.houses
				}}
			}
		},
		theWall: {
			name: 'theWall',
			url: '/the-wall',
			views: {
				content: { templateUrl: 'views/the-wall.html' }
			}
		}
	};

	$urlRouterProvider.otherwise('/the-wall');

	angular.forEach(states, function (state) {
		$stateProvider.state(state);
	});
});