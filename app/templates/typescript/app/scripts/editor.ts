module <%= names.alias %> {

    export class Configuration {

        static directory : string = "/app_plugins/<%= names.alias %>/";
        static views : string = Configuration.directory + "views/";

    }

}
