/**
 * Controls the main functionality of the application.
 * Sets current location if user accepts sharing his location.
 * Updates the venues list based on the user's selections.
 */
app.controller('VenuesController', function ($scope, $window, FoursquareAPIService) {

    // Initialize variables.
    var initialCoordinates, geolocationChanged = false;
    $scope.formGeolocationRadius = "500";
    $scope.formVenueType = "";
    $scope.geolocationPlaceholder = "Choose a place...";

    // Gets the new geolocation changed through the Google Maps Autocomplete Angular component.
    var getNewGeolocation = function () {
        var changedGeolocation = $scope.formGeolocationAutocomplete.getPlace().geometry.location;
        return {
            latitude: changedGeolocation.lat(),
            longitude: changedGeolocation.lng()
        }
    };

    // Gets the name of the user's geolocation using the Google Maps API and sets it as a placeholder.
    var setGeolocationPlaceholder = function (coordinates) {
        var currentGeoloction = new $window.google.maps.LatLng(coordinates.latitude, coordinates.longitude);
        new $window.google.maps.Geocoder().geocode({'latLng': currentGeoloction},
            function (results) {
                if (results[0]) {
                    $scope.geolocationPlaceholder = results[0].formatted_address;
                }
            });
    };

    // Updates venues list. The venue list is always retrieved through a new HTTP call.
    $scope.updateVenues = function () {
        $scope.loading = true;
        FoursquareAPIService.getVenues({
            position: !geolocationChanged ? initialCoordinates : getNewGeolocation(),
            radius: $scope.formGeolocationRadius || 500,
            section: $scope.formVenueType || "",
        }).then(function (venues) {
            $scope.loading = false;
            $scope.venues = venues;
        })
    };

    // Handles geolocation changes through the Google Maps Autocomplete Angular component.
    $scope.$on('gmPlacesAutocomplete::placeChanged', function () {
        geolocationChanged = true;
        $scope.venues = [];
        $scope.updateVenues();
    });

    // Asks for user's location.
    $window.navigator.geolocation.getCurrentPosition(function (data) {
        // Cache initial coordinates.
        initialCoordinates = data.coords;

        setGeolocationPlaceholder(data.coords);
        $scope.updateVenues();
    }, function (error) {
        console.log(error.message);
    });

});