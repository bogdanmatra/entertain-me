'use strict';

/**
 * Controls the main functionality of the application.
 * Sets current location if user accepts sharing his location.
 * Updates the venues list based on the user's selections.
 */
app.controller('VenuesController', function ($scope, FoursquareAPIService, GeolocationService) {

    // Initialize variables.
    var NO_GEOLOCATION_PLACEHOLDER = "Choose a place...";
    $scope.initialGeolocationChanged = false;
    $scope.formGeolocationRadius = "500";
    $scope.formVenueType = "";
    $scope.formGeolocationPlaceholder = NO_GEOLOCATION_PLACEHOLDER;
    $scope.moreFiltersDisabled = true;

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
        $scope.moreFiltersDisabled = false;
        $scope.updateVenues();
    });

    $scope.noGeolocationSelectedHandler = function () {
        if (!$scope.formGeolocationAutocomplete.getPlace) {
            $scope.moreFiltersDisabled = true;
            $scope.formGeolocationPlaceholder = NO_GEOLOCATION_PLACEHOLDER;
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
        }).catch(function () {
            $scope.loading = false;
        });
    }).catch(function () {
        $scope.loading = false;
    });

});