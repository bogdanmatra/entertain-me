'use strict';

/**
 * Controls the main functionality of the application.
 * Sets current location if user accepts sharing his location.
 * Updates the venues list based on the user's selections.
 */
app.controller('VenuesController', function ($scope, FoursquareAPIService, GeolocationService) {

    // Initialize variables.
    $scope.initialGeolocationChanged = false;
    $scope.formGeolocationRadius = "500";
    $scope.formVenueType = "";
    $scope.formGeolocationPlaceholder = "Choose a place...";

    // Select all the text from the input.
    $scope.selectAllText = function ($event) {
        $event.target.select();
    };

    // Updates venues list. The venue list is always retrieved through a new HTTP call.
    $scope.updateVenues = function () {
        $scope.loading = true;
        FoursquareAPIService.getVenues({
            position: !$scope.initialGeolocationChanged ?
                $scope.initialCoordinates : GeolocationService.getAutocompleteCoordinates($scope.formGeolocationAutocomplete),
            radius: $scope.formGeolocationRadius || 500,
            section: $scope.formVenueType || "",
        }).then(function (venues) {
            $scope.loading = false;
            $scope.venues = venues;
        })
    };

    // Handles geolocation changes through the Google Maps Autocomplete Angular component.
    $scope.$on('gmPlacesAutocomplete::placeChanged', function () {
        $scope.initialGeolocationChanged = true;
        $scope.venues = [];
        $scope.updateVenues();
    });

    // Asks for user's location.
    $scope.loading = true;
    GeolocationService.getCurrentGeolocationCoordinates().then(function (coordinates) {
        // Cache initial coordinates.
        $scope.initialCoordinates = coordinates;
        $scope.updateVenues();
        GeolocationService.getGeolocationName(coordinates).then(function (geolocationName) {
            $scope.formGeolocationPlaceholder = geolocationName;
        }).catch(function () {
            $scope.loading = false;
        });
    }).catch(function () {
        $scope.loading = false;
    });

});