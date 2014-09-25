angular.module("umbraco.filters").filter('<%= name %>', function() {
    return function(input) {
    	//See https://docs.angularjs.org/guide/filter
    	//And http://toddmotto.com/everything-about-custom-filters-in-angular-js/

    	//This is a simple filter that will make the input to uppercase
    	return input.toUpperCase();

    };
  });