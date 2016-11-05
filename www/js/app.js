// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

(function (angular) {
var app = angular.module('starter', ['ionic', 'starter.controllers']);

function router($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.details', {
  url:'/details',
  views:{
  	'menuContent': {
		templateUrl: 'templates/details.html',
		//controller: 'farmDetailCtrl',
		resolve:{
			loginChk : loginChk
		} 
	}
  }
  })

   .state('app.location', {
    url: '/location',
    views: {
      'menuContent': {
        templateUrl: 'templates/location.html',
		resolve:{
			loginChk : loginChk
		} 
      }
    }
  })
  .state('app.products', {
      url: '/products',
      views: {
        'menuContent': {
          templateUrl: 'templates/products.html',
		  resolve:{
			  loginChk : loginChk
		  } 
        }
      }
    })
    .state('app.photos', {
      url: '/photos',
      views: {
        'menuContent': {
          templateUrl: 'templates/photos.html',
          //controller: 'photosCtrl',
		  resolve:{
			  loginChk : loginChk
		  } 
        }
      }
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/details');
}
function loginChk ($rootScope, authServices, $location, $state){
	var token = window.localStorage.getItem('token');
	if (token === null || token === 'undefined' ) {
		var currentPage = $location.path().split('/').pop();
		if(currentPage === 'details'){
			console.log(token + ' no token'); 
			authServices.init($rootScope)
			.then(function(modal) {
			modal.show();
			});
		}else{
			$location.path('/app/details');
		}
	} 
}
app.run(function($ionicPlatform, $rootScope, $location, authServices) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

});
$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){});
});
app.config(router);
})(window.angular);



 
