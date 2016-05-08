'use strict';

angular.module('housePickerApp')
.factory('database', function ($resource) {
	var DB = $resource('https://api.mlab.com/api/1/databases/agot/collections/:collection/:docId?apiKey=JJmibN7eQsgIckAEc8PLbEAMuyyOhR-N', null, { update: { method: 'PUT'}});

	return {
		getUsers: function (success) {
			DB.query({
				collection: 'users'
			}, function (response) {
				if (angular.isFunction(success)) {
					return success(response[0]);
				}
			}, function (err) {
				console.log('Error: ', err);
				throw err;
			});
		},
		getHouses: function (success) {
			DB.query({
				collection: 'houses'
			}, function (response) {
					console.log('Houses: ', response[0]);
				if (angular.isFunction(success)) {
					return success(response[0]);
				}
			}, function (err) {
				console.log('Error: ', err);
				throw err;
			});
		},
		updateHouses: function (houseList, success) {
			//console.log('Saving: ', houseList);
			//let NewHouses = new DB(houseList);

			DB.update({
				collection: 'houses',
				docId: houseList._id.$oid
			}, {houses: houseList.houses}, function (response) {
				if (angular.isFunction(success)) {
					return success(response);
				}
			}, function (err) {
				console.log('Error: ', err);
				throw err;
			});
		},
		updateUsers: function (users, success) {
			//console.log('Saving: ', users);
			//let NewHouses = new DB(houseList);

			DB.update({
				collection: 'users',
				docId: users._id.$oid
			}, users, function (response) {
				if (angular.isFunction(success)) {
					return success(response);
				}
			}, function (err) {
				console.log('Error: ', err);
				throw err;
			});
		}
	};
});