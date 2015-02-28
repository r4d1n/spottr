angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, auth, $state, store) {
  auth.signin({
    closable: false,
    icon: "https://s3.amazonaws.com/limechile.com/spottr/spottr-logo.png",
    dict: {
      signin: {
       title: "digital scavenger hunt"       
      }
    },
    // This asks for the refresh token
    // So that the user never has to log in again
    authParams: {
      scope: 'openid offline_access'
    }
  }, function(profile, idToken, accessToken, state, refreshToken) {
    store.set('profile', profile);
    store.set('token', idToken);
    store.set('refreshToken', refreshToken);
    auth.getToken({
      api: 'firebase'
    }).then(function(delegation) {
      store.set('firebaseToken', delegation.id_token);
      $state.go('tab.friends');
    }, function(error) {
      console.log("There was an error logging in", error);
    })
  }, function(error) {
    console.log("There was an error logging in", error);
  });
})


.controller('FriendsCtrl', function($scope, Friends, $ionicModal, Camera, $files, $event) {
 $ionicModal.fromTemplateUrl('templates/friend-add-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.newFriend = {
    name: '',
    description: ''
  };


  $scope.friends = Friends.all();

  $scope.showAddFriend = function () {
      $scope.modal.show();
  };

  $scope.showFindPage = function () {

  }

  $scope.addFriend = function() {
    if(!$scope.newFriend.$id) {
      Friends.add($scope.newFriend);
    } else {
      Friends.save($scope.newFriend);
    }
    $scope.newFriend = {};
    $scope.modal.hide();
  };

  $scope.deleteFriend = function(friend) {
    Friends.delete(friend);
  };

  $scope.editFriend = function(friend) {
    $scope.newFriend = friend;
    $scope.modal.show();
  };

  $scope.close = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends, $sce) {
  $scope.$sce = $sce;
  $scope.friend = Friends.get($stateParams.friendId);
  var du = '<img class="full-size" src="data:image/jpeg;base64, ' + $scope.friend.finder.url + '">';
  $scope.dataUrl = $sce.trustAsHtml(du);
  // $('.full-image').attr('src', dataUrl);
})
    .config(function($compileProvider){
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    })

.controller('FriendsCtrl', function($scope, Friends, Camera, store) {
    $scope.friends = Friends.all();

    // $scope.getPhoto = function() {
    //     console.log('Getting camera');
    //     Camera.getPicture().then(function(imageURI) {
    //         console.log(imageURI);
    //         $scope.lastPhoto = imageURI;
    //     }, function(err) {
    //         console.err(err);
    //     }, {
    //         quality: 75,
    //         targetWidth: 320,
    //         targetHeight: 320,
    //         saveToPhotoAlbum: false
    //     });
    //     /*
    //      navigator.camera.getPicture(function(imageURI) {
    //      console.log(imageURI);
    //      }, function(err) {
    //      }, {
    //      quality: 50,
    //      destinationType: Camera.DestinationType.DATA_URL
    //      });
    //      */
    // }

    
    $scope.fileSelected = function ($files, $event, friend) {
        $scope.val = '';
        $scope.errorMessage = '';
        var file = $files[0];
        if (file) {
            var reader = new FileReader();
     
            reader.onload = function(readerEvt) {
                var binaryString = readerEvt.target.result;
                var profile = store.get('profile');
                friend.finder = {
                  url: btoa(binaryString),                  
                  name: profile.name,
                  pic: profile.picture
                };
                Friends.save(friend);
                // document.getElementById("base64textarea").value = btoa(binaryString);
                
            };
     
            reader.readAsBinaryString(file);
        }
    };
})

.controller('AccountCtrl', function($scope, auth, $state, store) {

  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    $state.go('login');
  }
});
