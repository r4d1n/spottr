angular.module('starter.services', ['firebase'])

/**
 * A simple example service that returns some data.
 */
.service('spots', function($firebase, store, $state) {

  var spotsRef = new Firebase("https://spottr.firebaseio.com/spots");
  spotsRef.authWithCustomToken(store.get('firebaseToken'), function(error, auth) {
    if (error) {
      // There was an error logging in, redirect the user to login page
      $state.go('login');
    }
  });

  var spotSync = $firebase(spotsRef);
  var spots = spotSync.$asArray();

  this.all = function() {
    return spots;
  };

  this.add = function(spot) {
    spots.$add(spot);
  };

  this.get = function(id) {
    return spots.$getRecord(id);
  };

  this.save = function(spot) {
    spots.$save(spot);
  };

  this.delete = function(spot) {
    spots.$remove(spot);
  };

});
