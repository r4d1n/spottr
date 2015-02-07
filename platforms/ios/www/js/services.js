angular.module('starter.services', ['firebase'])

    .factory('Camera', ['$q', function($q) {

        return {
            getPicture: function(options) {
                var q = $q.defer();

                navigator.camera.getPicture(function(result) {
                    // Do any magic you need
                    q.resolve(result);
                }, function(err) {
                    q.reject(err);
                }, options);

                return q.promise;
            }
        }
    }])

/**
 * A simple example service that returns some data.
 */



.service('Friends', function($firebase, store, $state) {

  var friendsRef = new Firebase("https://spottr.firebaseio.com");
  friendsRef.authWithCustomToken(store.get('firebaseToken'), function(error, auth) {

    if (error) {
      // There was an error logging in, redirect the user to login page
      $state.go('login');
    }
  });

  var friendsSync = $firebase(friendsRef);
  var friends = friendsSync.$asArray();

  this.all = function() {
    return friends;
  };

  this.add = function(friend) {
    friends.$add(friend);
  };

  this.get = function(id) {
    return friends.$getRecord(id);
  };

  this.save = function(friend) {
    friends.$save(friend);
  };

  this.delete = function(friend) {
    friends.$remove(friend);

  };

});
