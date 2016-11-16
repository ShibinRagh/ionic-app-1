angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $http, $location, authServices) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

// signout
// =======
$scope.signout = function(){
	window.localStorage.removeItem('token');
	var currentPage = $location.path().split('/').pop();
	if(currentPage === 'register'){
	  authServices.init($scope)
		  .then(function(modal) {
		  modal.show();
	  	})
	}else{
		$location.path('app/register');
	}
}
})
.controller('loginCtrl', function($scope, $state, $location, $http, authServices, Resources) {
  // Perform the login action when the user submits the login form
  //==============================================================
	 
  $scope.loginData = {};
  $scope.doLogin = function(form) {
	  if (form.$valid) {
		  $http.post(Resources.API +'/api/moderator/login', $scope.loginData ).success(function(response ){
			  $scope.response = response.data;
			  $scope.responseStatus = response.status;
			  console.log($scope.response);
			  if( $scope.responseStatus === 'success'  ){
				authServices.getLoggedIn($scope.response);
				$scope.closeLogin();
				$state.go('app.register');
			  }else{
				$scope.errormessage = $scope.response.message
				console.log('err' + $scope.errormessage)
			  }
		  }).error(function(err){
			  $scope.errormessage = err
			  console.log('no enter' + $scope.errormessage)
		  })
	  }
  };
	
})
.controller('farmRegisterCtrl', function($scope, $http){
	$scope.farm = {};
	$scope.doFarmRegister = function(form){
		console.log($scope.farm + '-' );
			if (form.$valid) {
				alert('our form is amazing');
			}
	}
})
.controller('locationCtrl', function(){
	//getLocation
	//===========
	console.log($('#latitude').val() +'helllooo'+ $('#longitude').val());
	 
	
	var mapDiv = document.getElementById("farmLctnMap");
	recivedPos = false;
	
	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition, showError);
			setTimeout(function(){
				if (!recivedPos){
					mapInitial();
				}
			},4000)
			 
		} else {
			mapDiv.innerHTML = "Geolocation is not supported by this browser.";
			var lat = $('#latitude').val();
			var lng = $('#longitude').val();
			mapInitial();
		}
	}
	
	
	//showPosition
	//============
	function showPosition(position) {
		recivedPos = true;
		console.log ("Latitude: " + position.coords.latitude + 
		"<br>Longitude: " + position.coords.longitude);
		
		$('#latitude').val(position.coords.latitude);
		$('#longitude').val(position.coords.longitude);
		mapInitial();
		//alert('poswaiting');
	}
	//showError
	//============
	function showError(error) {
		recivedPos = true;
		mapInitial();
		switch(error.code) {
			case error.PERMISSION_DENIED:
				alert("User denied the request for Geolocation.");
				break;
			case error.POSITION_UNAVAILABLE:
				alert("Location information is unavailable.");
				break;
			case error.TIMEOUT:
				alert("The request to get user location timed out.");
				break;
			case error.UNKNOWN_ERROR:
				alert("An unknown error occurred.");
				break;
		}
	}
	//getLocation
	//===========
	 
	 
	getLocation();
	 
	 
 
		
	//mapInitial
	//=========
	function mapInitial (){
		var lat = $('#latitude').val();
		var lng = $('#longitude').val();
		console.log(lat + lng + 'mapInitial');
		if (lat && lng) {
			olat = lat;
			olng = lng;
			console.log(olat + olng + 'mapInitialInCondition');
		} else {
			olat = "";
			olng = "";
		}
		setmap(olat, olng);
	}
	//setlatlng
	//=========
	function setlatlng() {
        // show current location  / saved location in map 
        var lat = $('#latitude').val();
        var lng = $('#longitude').val();
        if (lat && lng) {
            olat = lat;
            olng = lng;
        } else {
            olat = $.cookie('userLatitude');
            olng = $.cookie('userLongitude');
            $('#latitude').attr('value', olat);
            $('#longitude').attr('value', olng);
        }
        setmap(olat, olng);
    };
	//setmap
	//======
	function setmap(olat, olng) {
        var myCenter = new google.maps.LatLng(olat, olng);
        var input = document.getElementById('place');
        var autocomplete1 = new google.maps.places.Autocomplete(input);
        var latlng = new google.maps.LatLng(olat, olng);
        if (document.getElementById("farmDtlMap")) {
            var mapProp = {
                center: myCenter,
                scrollwheel: false,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("farmDtlMap"), mapProp);
            var marker = new google.maps.Marker({
                draggable: false,
                position: latlng,
                map: map,
                title: "Your location"
            });
        }
        if (document.getElementById("farmLctnMap")) {
            var mapProp = {
                center: myCenter,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("farmLctnMap"), mapProp);
            var marker = new google.maps.Marker({
                draggable: true,
                position: latlng,
                map: map,
                title: "Your location"
            });
        }
/*        if (document.getElementById("map")&& $('.farmersMarketLocation').length) {
            var mapProp = {
                center: myCenter,
                scrollwheel: false,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"), mapProp);
            var marker = new google.maps.Marker({
                draggable: false,
                position: latlng,
                map: map,
                title: "Your location"
            });
        }*/
        marker.setMap(map);
        google.maps.event.addListener(marker, 'dragend', function(event) {
            $("#place").val(' ');
            $('#latitude').val(event.latLng.lat());
            $('#longitude').val(event.latLng.lng());
            getReverseGeocodingData(event.latLng.lat(), event.latLng.lng())
        });

        google.maps.event.addListener(autocomplete1, 'place_changed', function() {
            var place = autocomplete1.getPlace();
            if (!place.geometry) {
                return;
            }
            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(15);
            }
            $('#latitude').attr('value', place.geometry.location.lat());
            $('#longitude').attr('value', place.geometry.location.lng());
            $('#error').hide();
            $('#locationUpdateBtn').removeAttr('disabled');
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);
        });
    }
	//getReverseGeocodingData
	//=======================
    function getReverseGeocodingData(lat, lng) {
        var latlng = new google.maps.LatLng(lat, lng);
        // This is making the Geocode request
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'latLng': latlng }, function(results, status) {
            if (status !== google.maps.GeocoderStatus.OK) {
                alert(status);
            }
            // This is checking to see if the Geoeode Status is OK before proceeding
            if (status == google.maps.GeocoderStatus.OK) {
                var address = (results[0].formatted_address);
                $("#place").val(address);
            }
        });
    }
	
 
})
.controller('productsCtrl', function($scope, $http, Resources, Upload){
	var userId = window.localStorage.getItem('userId');
	$scope.subCategoriesBlock = false;
	$scope.productNameBlock = false;
	$scope.productFormBlock = false;
	$scope.product ={};
	var token = window.localStorage.getItem('token');
	console.log(token);
	$http.get(Resources.API +'/api/moderator/addProduct/?farmId=581ac91a6879d2d60daa9ee8', {
		headers: {'accesstoken': token}
	}).then(function(response){
			$scope.productsCategories = response.data.results.categories;
		console.log($scope.productsCategories);
	});
	$scope.openSubCategory = function(selectedPDC) {
		console.log(selectedPDC._id);
		$scope.pdcID = selectedPDC._id;
		$http.get(Resources.API +'/api/moderator/listCategory?categoryId='+$scope.pdcID, {
				headers: {'accesstoken': token}
			}).then(function(response){
					console.log(response);
					$scope.subProductsCategories = response.data.subCategories;
					if($scope.subProductsCategories.length > 0){
						$scope.subCategoriesBlock = true;
						//console.log($scope.subProductsCategories);
						$scope.subCategoryID = response.data.subCategories._id;
					}else{
						$scope.subCategoriesBlock = false;
					}
			});
	}
	$scope.openProductName = function(selectedSubPDC){
		console.log('test');
		$scope.selectedSubPDCid = selectedSubPDC._id;
		console.log($scope.selectedSubPDCid + 'test');
		$http.get(Resources.API + '/api/moderator/searchProduct/',{
			headers: {'accesstoken': token},
			params:  {'farmId': '581ac91a6879d2d60daa9ee8', 'categoryId': $scope.selectedSubPDCid, 
					  'productName': ''}
		}).then(function(response){
			$scope.productDetails = response.data.productDetails;
			$scope.productNameBlock = true;
			console.log(response); 
		})
	}
	$scope.openProductDetail = function(selectedProduct){
		$scope.productFormBlock = true;
		console.log(selectedProduct);
		$scope.productID = selectedProduct._id;
		$scope.productName = selectedProduct.productName;
	}
	
	//===================================
	// image upload
	//===================================
 
	//===================================
	// end
	//===================================
	$scope.doSaveProduct = function(saveProduct){
		console.log('1'+saveProduct );
		console.log('2'+$scope.product)
		file = saveProduct.picFile;
		//$scope.product.image = file;
		console.log('productId:' + $scope.productID,
				   	'farmId:581ac91a6879d2d60daa9ee8'
					
				   );
		file.upload = Upload.upload({
		  url: Resources.API +'/api/moderator/saveProduct',
		  data: {productId: $scope.productID,
				 farmId: '581ac91a6879d2d60daa9ee8',
				 productName: $scope.productName,
				 price: 100,
				 quantity: 1,
				 priceUnit: 'kg',
				 farmName: '',
				 image: file,
				 productCategory:$scope.pdcID,
				 //accesstoken: token,
				 userId:userId
				},
			headers: {'accesstoken': token}
			
		  //data:$scope.product,
		});
		console.log($scope.product);
		//callback
		//========
		file.upload.then(function (response) {
		  $timeout(function () {
			file.result = response.data;
			 console.log(response);
		  });
		}, function (response) {
		  if (response.status > 0)
			$scope.errorMsg = response.status + ': ' + response.data;
		}, function (evt) {
		  // Math.min is to fix IE which reports 200% sometimes
		  file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		});
	}
})
.controller('photosCtrl', function($scope, $http){
	$scope.farm = {};
	$scope.doFarmPhotos = function(form){ 
		if (form.$valid) {
			alert(0);
		}else{
			alert(1);
		}
		console.log($scope.farm.test);
		console.log($scope.farm.productThumbImg);
		console.log($scope.farm.bannerimg);
	}
})


 
