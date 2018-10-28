'use-strict';

/**
 * Geolocation Service exposes Google Maps services and browser location services.
 */
app.service('GeolocationService', function ($window, $q) {
    /**
     * Gets the new coordinates changed through the Google Maps Autocomplete Angular component.
     */
    this.getAutocompleteCoordinates = function (autocomplete) {
        var changedGeolocation = autocomplete.getPlace().geometry.location;
        return {
            latitude: changedGeolocation.lat(),
            longitude: changedGeolocation.lng()
        }
    };

    /**
     * Gets the name of the geolocation using the Google Maps API.
     */
    this.getGeolocationName = function (coordinates) {
        return $q(function (resolve, reject) {
            var currentGeoloction = new $window.google.maps.LatLng(coordinates.latitude, coordinates.longitude);
            new $window.google.maps.Geocoder().geocode({'latLng': currentGeoloction},
                function (results) {
                    if (results[0]) {
                        resolve(results[0].formatted_address);
                    } else {
                        reject(new Error("No name available for the location."));
                    }
                });
        });
    };

    /**
     * Gets the coordinates of the current user's position.
     */
    this.getCurrentGeolocationCoordinates = function () {
        return $q(function (resolve, reject) {
            $window.navigator.geolocation.getCurrentPosition(function (data) {
                resolve(data.coords);
            }, function (error) {
                reject(new Error(error.message));
            });
        });
    }
});