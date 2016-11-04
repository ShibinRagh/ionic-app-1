// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform, $rootScope, $location, authServices) {
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

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
 
		if (!window.localStorage.getItem("token")) {
			authServices.init($rootScope)
			.then(function(modal) {
			modal.show();
			});
			$location.path('/app/details');
			console.log(' no token');
		}else{
			console.log(' token');
		}
 
});

})

.config(function($stateProvider, $urlRouterProvider) {
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
		templateUrl: 'templates/details.html'
		//controller: 'farmDetailCtrl'
	}
  }	
  })

   .state('app.location', {
    url: '/location',
    views: {
      'menuContent': {
        templateUrl: 'templates/location.html'
      }
    }
  })
  .state('app.products', {
      url: '/products',
      views: {
        'menuContent': {
          templateUrl: 'templates/products.html'
        }
      }
    })
    .state('app.photos', {
      url: '/photos',
      views: {
        'menuContent': {
          templateUrl: 'templates/photos.html',
          controller: 'photosCtrl'
        }
      }
    })

/*  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })*/ 
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/details');
});
