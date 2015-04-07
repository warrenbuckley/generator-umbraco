module <%= names.alias %>.Services {
	'use strict';
	
	export interface I<%= names.alias %>Service{
        greeting(name : string, age : number) : string;
        farewell(name : string) : string;
    }

	export class <%= names.alias %>Service implements I<%= names.alias %>Service {
		// $inject annotation.
		// It provides $injector with information about dependencies to be injected into constructor
		// it is better to have it close to the constructor, because the parameters must match in count and type.
		// See http://docs.angularjs.org/guide/di
		static $inject = ['$http'];
		constructor(private $http : ng.IHttpService) {
			
		}


		greeting(name: string, age : number) : string{
			return "Hello " + name + " you are " + age + " years old";
		}


		farewell(name: string) : string{
			return "Goodbye " + name;
		}	
	}


	angular.module("umbraco.services").service("<%= names.alias %>Service", <%= names.alias %>Service);
}