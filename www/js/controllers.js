angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $http, $location, authServices) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
	
	//global variables
	$scope.wHeight = $(window).height();

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
.controller('loginCtrl', function($scope, $state, $http, authServices, Resources) {
  // Perform the login action when the user submits the login form
  //==============================================================
	 
  $scope.loginData = {};
  $scope.btnLoader = false;
  $scope.doLogin = function(form) {
	  if (form.$valid) {
		  $scope.btnLoader = true;
		  $http.post(Resources.API +'/api/moderator/login', $scope.loginData ).success(function(response ){
			  $scope.response = response.data;
			  $scope.responseStatus = response.status;
			  console.log($scope.response);
			  $scope.btnLoader = false;
			  if( $scope.responseStatus === 'success'  ){
				authServices.getLoggedIn($scope.response);
				$scope.closeLogin();
				$state.go('app.selectfarm');
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
.controller('farmRegisterCtrl', function($scope, $http, $state, $timeout, authServices, Resources){
	$scope.farm = {};
	$scope.farmRegisterStatusSuccess = '';
	$scope.farmRegisterStatusError = '';
	$scope.btnLoader = false;
	$scope.doFarmRegister = function(form){
		console.log(token);
			if (form.$valid) {
				$scope.btnLoader = true;
				$http.post(Resources.API + '/api/moderator/farmRegister', $scope.farm,{
					headers: {'accesstoken': token}
				}).then(function(response){
					$scope.btnLoader = false;
					if( response.data.status ){
						$scope.selectedFarmID = response.data.farmId;
						authServices.selectFarm($scope.selectedFarmID);
						$scope.farmRegisterStatusError = '';
						$scope.farmRegisterStatusSuccess = 'Successfully registered new farm';
						$timeout(function(){
							$scope.farmRegisterStatusSuccess = '';
							$state.go('app.location');
						}, 1000);
					}else{
						$scope.farmRegisterStatusSuccess = '';
						$scope.farmRegisterStatusError = response.data.msg;
					}
				},function(error){
					console.log(error);
				});
			}
	}
})
.controller('locationCtrl', function($scope, $http, $state, $timeout, Resources){
	$scope.btnLoader = false;
	//getLocation
	//===========
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
		$('#latitude').val(position.coords.latitude);
		$('#longitude').val(position.coords.longitude);
		mapInitial();
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
	 
	// call get location function
	//===========================
	getLocation();
	 
		
	//mapInitial
	//=========
	function mapInitial (){
		$('#farmLctnMap').height( $scope.wHeight - ( $('#farmLctnMap').offset().top + $('.farm-location button').outerHeight(true) + 20 ) );
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
		getReverseGeocodingData(olat, olng);
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
			console.log('dra');
            $("#place").val(' ');
            $('#latitude').val(event.latLng.lat());
            $('#longitude').val(event.latLng.lng());
            getReverseGeocodingData(event.latLng.lat(), event.latLng.lng());
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
	
	//location update
	//===============
	$scope.updateLocation = function(){
		$scope.locationStatusSuccess= '';
		$scope.locationStatusError= '';
		$scope.latValue = $('#latitude').val();
		$scope.lonValue = $('#longitude').val();
		$scope.adddressValue = $('#place').val();
		$scope.btnLoader = true;
		console.log(token);
		$http.post(Resources.API + '/api/moderator/updateFarmLocation', 
			{'latitude': $scope.latValue, 'longitude': $scope.lonValue, 'place': $scope.adddressValue},
			{headers:{'accesstoken': token },
			params: {'farmId': farmId } 
			}).then(function(response){
			$scope.btnLoader = false;
				if(response.data.status){
					//console.log(response.data.msg);
					$scope.locationStatusSuccess = response.data.msg;
					$timeout(function(){
						$state.go('app.products');
						$scope.locationStatusSuccess= '';
					},1000)
				}else{
					$scope.locationStatusError = response.data.msg;
				}
			},function(error){
				
			}
		);
	};
 
})
.controller('productsCtrl', function($scope, $http, $state, $timeout, Resources){
	$scope.subCategoriesBlock = false;
	$scope.productNameBlock = false;
	$scope.productFormBlock = false;
	$scope.productNotAdded = false;
	$scope.btnLoader = false;
	$scope.productsCategories = {};
	$scope.categoryId = {};
	$scope.subCategoryID={};
	$scope.productDetails ={};
	$scope.product ={};
	$scope.addedProducts = {};
	 
	// product main categories listing
	//================================
	 
	$http.get(Resources.API +'/api/moderator/addProduct/', {
		headers: {'accesstoken': token},
		params: {'farmId': farmId}
	}).then(function(response){
			$scope.productsCategories = response.data.results.categories;
		//console.log('first Con'+ JSON.stringify(response.data.results)); 
	}, function(error){
		console.log('error-'+error);
	});
	// click on main category to open sub category
	//============================================
	$scope.openSubCategory = function(selectedPDC) {
		$scope.categoryId = selectedPDC._id;
		$http.get(Resources.API +'/api/moderator/listCategory?categoryId='+$scope.categoryId, {
				headers: {'accesstoken': token}
			}).then(function(response){
					$scope.subProductsCategories = response.data.subCategories;
					$scope.productDetails= {};
					if($scope.subProductsCategories.length > 0){
						$scope.subCategoriesBlock = true;
						$scope.subCategoryID = response.data.subCategories._id;
						$scope.productNameBlock = false;
					}else{
						$scope.subCategoriesBlock = false;
						// product name list function
						// ==========================
						productNameList($scope.categoryId);
					}
					$timeout(function() {
						$scope.productFormBlock = false; 
					});
			});
	}
	
	// product name list function
	// ==========================
	function productNameList(subCategoryId){
		$scope.subCategoryId = subCategoryId;
		$http.get(Resources.API + '/api/moderator/searchProduct/',{
			headers: {'accesstoken': token},
			params:  {'farmId': '5821b190a7b4f58873e22a3e', 
					  'categoryId': $scope.subCategoryId, 
					  'productName': ''
					 }
		}).then(function(response){
			$scope.productDetails = response.data.productDetails;
			$scope.addedProducts = response.data.farmProductIds;
			$scope.productNameBlock = true;
		})
	}
	// click on subcategory to list product name
	//==========================================
	$scope.openProductName = function(selectedSubPDC){
		$scope.subCategoryId = selectedSubPDC._id;
		productNameList($scope.subCategoryId);
	}
	// click on product name to open product detail form
	//==================================================
	$scope.openProductDetail = function(selectedProduct){
		// updating product keys
		//======================
		$scope.productId = selectedProduct._id;
		$scope.productName = selectedProduct.productName;
		$scope.productImage = selectedProduct.image;
		$scope.productUnit = selectedProduct.unit;
		$('.price-unity').val($scope.productUnit);
		var i;
		for( i = 0;  i < $scope.addedProducts.length; i++ ){
			if( $scope.addedProducts[i] === $scope.productId   ){
				$scope.productFormBlock = false;
				$scope.productNotAdded = true;
				return i
			}
		} 
		$scope.productFormBlock = true;
		$scope.productNotAdded = false;
		return i
	}
	
	// save new product
	//=================
	$scope.doSaveProduct = function(saveProduct){
		$scope.btnLoader = true;
	$http.post(Resources.API +'/api/moderator/saveProduct', 
			  {
				 productId: $scope.productId,
				 farmId: '5821b190a7b4f58873e22a3e',
				 productName: $scope.productName,
				 price: $scope.product.price,
				 quantity: $scope.product.quantity,
				 priceUnit: $scope.productUnit,
				 image: $scope.productImage,
				 productCategory:$scope.categoryId,
				 userId:userId
				},
			   {headers: {'accesstoken': token}}
	).success(function(response ){
		 $scope.btnLoader = false;
		if( response.status ){
			$scope.productAddStatusError = ''; 
			$scope.productAddStatusSuccess = response.msg.message; 
			$timeout(function(){
				$state.go('app.photos'); 
			},1000);
		}else{
			$scope.productAddStatusSuccess = '';
			$scope.productAddStatusError = response.msg.message;  
		}
	})
	}
})
.controller('photosCtrl', function($scope, $http, Resources, Upload){
	$scope.doFarmPhotos = function(farmPhotos){ 
		$scope.thump = farmPhotos.thump;
		$scope.banner = farmPhotos.banner;
		Upload.upload({
		  url: Resources.API +'/api/moderator/UploadFarmImages',
		  data: {
				 farmId: '5821b190a7b4f58873e22a3e',
				 banner: $scope.banner,
				 thump: $scope.thump,
				},
			headers: {'accesstoken': token}
		}).then(function (resp) {
			console.log(resp, resp.data.message);
           // console.log('Success ' + resp.config.data.banner.name + 'uploaded. Response: ' + resp.data);
			if( resp.status ){
				$scope.photoStatusSuccess = resp.data.message;
			}else{
				$scope.photoStatusError = resp.data.message;
			}
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
			console.log(evt.config);
			
			/*var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			if( evt.config.data.banner.name = farmPhotos.banner.name){
				console.log(evt.config.data.myfile.name ,  farmPhotos.banner.name );
				console.log('progress: ' + progressPercentage + '% ' + evt.config.data.myfile.name);
			}else if( evt.config.data.thump.name === farmPhotos.thump.name ){
				//console.log('progress: ' + progressPercentage + '% ' + evt.config.data.thump.name);
			}*/
            
            
        });
	}
})

 
.controller('selectfarmCtrl', function(){

})


 
