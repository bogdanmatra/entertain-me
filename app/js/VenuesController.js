'use strict';

/**
 * Controls the main functionality of the application.
 * Sets current location if user accepts sharing his location.
 * Updates the venues list based on the user's selections.
 */
app.controller('VenuesController', function ($scope, FoursquareAPIService, GeolocationService) {

    // Initialize variables.
    var NO_GEOLOCATION_PLACEHOLDER_DEFAULT = "Choose a place...";
    var VENUE_RADIUS_DEFAULT = "500";
    var VENUE_TYPE_DEFAULT = "";
    $scope.initialGeolocationChanged = false;
    $scope.formGeolocationRadius = VENUE_RADIUS_DEFAULT;
    $scope.formVenueType = VENUE_TYPE_DEFAULT;
    $scope.formGeolocationPlaceholder = NO_GEOLOCATION_PLACEHOLDER_DEFAULT;
    $scope.moreFiltersDisabled = true;

    // Select all the text from the input.
    $scope.selectAllText = function ($event) {
        $event.target.select();
    };

    // Updates venues list. The venue list is always retrieved through a new HTTP call.
    $scope.updateVenues = function () {
        $scope.venues = [];
        $scope.loading = true;
        FoursquareAPIService.getVenues({
            position: !$scope.initialGeolocationChanged ?
                $scope.initialCoordinates : GeolocationService.getAutocompleteCoordinates($scope.formGeolocationAutocomplete),
            radius: $scope.formGeolocationRadius || VENUE_RADIUS_DEFAULT,
            section: $scope.formVenueType || VENUE_TYPE_DEFAULT,
        }).then(function (venues) {
            $scope.venues = venues;
        }).finally(function () {
            $scope.loading = false;
        })
    };

    // Handles geolocation changes through the Google Maps Autocomplete Angular component.
    $scope.$on('gmPlacesAutocomplete::placeChanged', function () {
        if ($scope.formGeolocationAutocomplete.getPlace().geometry) {
            $scope.initialGeolocationChanged = true;
            $scope.moreFiltersDisabled = false;
            $scope.updateVenues();
        }
    });

    $scope.noGeolocationSelectedHandler = function () {
        if (!$scope.formGeolocationAutocomplete.getPlace) {
            $scope.moreFiltersDisabled = true;
            $scope.formGeolocationPlaceholder = NO_GEOLOCATION_PLACEHOLDER_DEFAULT;
            $scope.venues = [];
        }
    }

    // Asks for user's location.
    $scope.loading = true;
    GeolocationService.getCurrentGeolocationCoordinates().then(function (coordinates) {
        // Cache initial coordinates.
        $scope.initialCoordinates = coordinates;

        $scope.moreFiltersDisabled = false;
        $scope.updateVenues();
        GeolocationService.getGeolocationName(coordinates).then(function (geolocationName) {
            $scope.formGeolocationPlaceholder = geolocationName;
        }).finally(function () {
            $scope.loading = false;
        });
    }).finally(function () {
        $scope.loading = false;
    });

});
