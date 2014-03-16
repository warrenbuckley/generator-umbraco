angular.module('umbraco').controller('<%= names.ctrl %>', function($scope, assetsService) {

	//Property Editor has loaded...
	console.log('Hello from <%= names.ctrl %>');

	//Load the General Google JS API Loader
    assetsService.loadJs('http://www.google.com/jsapi').then(function () {

        //Once this file has loaded, let's go & load the Google Maps API
        google.load("maps", "3", {
            callback: mapInit,
            other_params: "sensor=false"
        });
    });

    //Map init
    function mapInit() {

        console.log('map init');

        //Get default config options
        //Try get them from saved value first if not fallback to cdefault config
        var zoomLevel   = parseInt($scope.model.value.zoom) || parseInt($scope.model.config.zoom);
        var lat         = $scope.model.value.lat || $scope.model.config.lat;
        var lng         = $scope.model.value.lng || $scope.model.config.lng;
        var mapType     = $scope.model.value.maptype || $scope.model.config.maptype;

        //Get the latLng as the Google Maps LatLng object
        var latLng = new google.maps.LatLng(lat, lng);

        //Get the DIV in the HTML markup we apply the map to
        var mapDiv = document.getElementById($scope.model.alias + '-google-map');

        //This is used to allow us geocode address etc...
        var geoCoder = new google.maps.Geocoder();

        //Initial options for the map load
        var mapOptions = {
            zoom: zoomLevel,
            center: latLng,
            mapTypeId: google.maps.MapTypeId[mapType]
        };

        //Create the map (pass in DIV & the options we want)
        var map = new google.maps.Map(mapDiv, mapOptions);

        //Add a marker to the map that is the map center
        var marker = new google.maps.Marker({
            map: map,
            position: latLng,
            draggable: true
        });

        //if no value saved yet
        if (!$scope.model.value) {
            console.log('No value saved yet, use initial config');

            updateValues(map, marker);
        }


        //So when an Umbraco tab is shown/changed to another
        $('a[data-toggle="tab"]').on('shown', function (e) {
            //This allows us to re-draw the map
            google.maps.event.trigger(map, 'resize');
        });

        //Add an event listened when the google map marker has stopped being dragged...
        google.maps.event.addListener(marker, "dragend", function (e) {
            console.log('Drag End', marker);

            //Update Values
            updateValues(map, marker);
        });

        //Map type change event
        google.maps.event.addListener(map, 'maptypeid_changed', function (e) {
            console.log('Map Type Changed', map);

            //Update Values
            updateValues(map, marker);
        });

        //Change Zoom level event
        google.maps.event.addListener(map, 'zoom_changed', function (e) {
            console.log('Zoom Changed', map);

            //Update Values
            updateValues(map, marker);
        });
    };

	//Update values for our JSON
    function updateValues(map, marker) {

        // MapType's are:
        // HYBRID, ROADMAP, SATELLITE, TERRAIN

        //Update our scope which is a JSON object
        $scope.model.value = {
            "lat": marker.getPosition().lat(),
            "lng": marker.getPosition().lng(),
            "zoom": map.getZoom(),
            "maptype": map.getMapTypeId()
        };
    };

});