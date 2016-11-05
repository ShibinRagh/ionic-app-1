angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $http, authServices) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
console.log('appctrl');
  // Form data for the login modal
  
 
  // Triggered in the login modal to close it
/*  $scope.closeLogin = function() {
	  	  console.log('hi');
	  alert(0);
	  $scope.modal.hide();
  };*/

  // Open the login modal
/*  $scope.login = function() {
	  authServices.init($scope)
		  .then(function(modal) {
		  modal.show();
	  	});
  };*/
$scope.signout = function(){
	console.log(window.localStorage.getItem("token"))
	window.localStorage.removeItem('token');
	console.log('rmvd' + window.localStorage.getItem("token"))
}
	

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('loginCtrl', function($scope, $state, $location, $http, authServices) {
	console.log('----------');
  // Perform the login action when the user submits the login form
  $scope.loginData = {};
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
	  $http.post('http://192.168.2.58:7000/api/moderator/login', $scope.loginData ).success(function(response){
		  console.log(response.status , response + '--succ');
		  if( response.status  ){
		  	authServices.getLoggedIn(response.userId);
			$scope.closeLogin();
		  	$state.go('app.details');
		  }
	  }).error(function(err){
	  	console.log(err  + '--err');
	  })
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
 
  };
	
});
