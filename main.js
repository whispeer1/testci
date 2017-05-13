var app = angular.module("app", []);
    
    app.controller("purchaseController", function ($scope, $http) {
    	

    	$scope.name = "NAMENAME";
    	$scope.text = "";
    	$scope.result = "";

    	$scope.click = function(){
    		$scope.text = "(new)222";

    		$http({method: 'GET', url: 'http://localhost:81/api/get'})
    		.then(function successCallback(response) {
    			$scope.result = response.data;
    		}, function errorCallback(response) {
    			console.log(response)
    		});
    	}

	});