angular.module('starter').factory('authServices', ['$http', '$ionicModal', '$rootScope', function($http, $ionicModal, $rootScope){
	return{
		// login popup
		// ===========
		init:  function($scope) {
			var promise;
			$scope = $scope || $rootScope.$new();

			promise = $ionicModal.fromTemplateUrl('templates/login.html', {
			  scope: $scope,
			  animation: 'slide-in-up'
			}).then(function(modal) {
			  $scope.modal = modal;
			  return modal;
			});

			 $scope.login = function() {
			   $scope.modal.show();
			 };
			 $scope.closeLogin = function() {
			   $scope.modal.hide();
			 };
			 $scope.$on('$destroy', function() {
			   $scope.modal.remove();
			 }); 

			return promise;
		  },
		getLoggedIn: function(user){
			$rootScope.user = user;
			window.localStorage.setItem("token", user);
			console.log(user);
		} 
	}

}]);