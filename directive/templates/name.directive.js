angular.module('umbraco.directives').directive('<%= directiveName %>', function () {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '/App_Plugins/Example/umb-media-picker.html',
		require: "ngModel",
		link: function (scope, element, attr, ctrl) {

			//Lots of ways to do directives...
			//Please refer to the AngularJS docs for awesome guide/tutorial
			//https://docs.angularjs.org/guide/directive

			
		};
	}
});