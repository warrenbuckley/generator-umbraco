module <%= names.alias %>.Controllers {
    'use strict';
    interface <%= names.alias %>Model  {
		value : any;
        config : any;
        alias : string;
        label : string;
        onValueChanged : (newVal : any, oldVal : any) => void;
	}

    interface I<%= names.alias %>ControllerScope extends ng.IScope {
        model : <%= names.alias %>Model;
        changeModel : (str : string) => void;
    }

    export class <%= names.alias %>Controller {

		static $inject = ['$scope', '<%= names.alias %>Service'];
		constructor(private $scope : I<%= names.alias %>ControllerScope,  private <%= names.alias %>Service : <%= names.alias %>.Services.I<%= names.alias %>Service) {

            $scope.model.value = this.<%= names.alias %>Service.greeting("name", 123);

            //start writing your controller logic
            $scope.changeModel = function(str){
                $scope.model.value = str;
            }
        }
    }

    angular.module('umbraco').controller('<%= names.ctrl %>', <%= names.alias %>Controller);
}
