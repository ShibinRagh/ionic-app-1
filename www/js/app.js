// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

(function (angular) {
var app = angular.module('starter', ['ionic', 'starter.controllers', 'ngFileUpload']);
app.constant("Resources", {
	"API": "http://192.168.2.41:7000" //without end slash '/'
});
	
function router($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.selectfarm', {
  url:'/selectfarm',
  views:{
  	'menuContent': {
		templateUrl: 'templates/selectfarm.html',
		controller: 'selectfarmCtrl', 
		resolve:{
			loginChk : loginChk
		} 
	}
  }
  })
  
  .state('app.register', {
  url:'/register',
  views:{
  	'menuContent': {
		templateUrl: 'templates/register.html',
		controller: 'farmRegisterCtrl', 
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
		controller: 'locationCtrl',
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
		  controller: 'productsCtrl',
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
          controller: 'photosCtrl',
		  resolve:{
			  loginChk : loginChk
		  } 
        }
      }
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/register');
}
function loginChk ($rootScope, authServices, $location, $state){
	token =  window.localStorage.getItem('token');
	userId = window.localStorage.getItem('userId');
	farmId = window.localStorage.getItem('farmId');
	
	console.log(farmId +'-'+ userId +'-'+ token);
	// temporary fn
	$rootScope.test = function(){
		authServices.init($rootScope)
		.then(function(modal) {
			modal.show();
		});
	};
	if (token === null || token === 'undefined' ) {
		var currentPage = $location.path().split('/').pop();
		if(currentPage === 'register'){
			console.log(token + ' no token'); 
			authServices.init($rootScope)
			.then(function(modal) {
			modal.show();
			});
		}else{
			$location.path('/app/register');
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

	
$(document).on({
    'DOMNodeInserted': function() {
        $('.pac-item, .pac-item span', this).addClass('needsclick');
    }
},'.pac-container');
	
});
app.config(router);
})(window.angular);



 
