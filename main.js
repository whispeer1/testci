var app = angular.module("app", []);
    
    app.controller("purchaseController", function ($scope) {
    	

    	$scope.name = "NAMENAME";
    	$scope.text = "";

    	$scope.click = function(){
    		$scope.text = "clicked";
    	}

	});