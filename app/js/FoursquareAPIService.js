'use strict';

/**
 * A service which connects to the Foursquare HTTP API.
 */
app.service('FoursquareAPIService', function ($http, FoursquareConstants, $window) {
    /**
     * Returns venues relative to a geolocation (https://developer.foursquare.com/docs/api/venues/explore).
     * Also supports `radius` (geolocation search radius) and `section` (the venue type).
     */
    this.getVenues = function (params) {
        var latitudeLongitude = params.position.latitude + FoursquareConstants.COORDINATE_SEPARATOR + params.position.longitude;
        return $http({
            url: FoursquareConstants.ENDPOINT + FoursquareConstants.VERSION + FoursquareConstants.VENUES_EXPLORE,
            method: "GET",
            params: {
                client_id: FoursquareConstants.CLIENT_ID,
                client_secret: FoursquareConstants.CLIENT_SECRET,
                v: FoursquareConstants.VERSIONING,
                ll: latitudeLongitude,
                radius: params.radius,
                section: params.section
            }
        }).then(function (response) {
            // Build an array only with the necessary data (venues).
            return response.data.response.groups[0].items.map(function (item) {
                return item.venue;
            });
        }).catch(function (response) {
            $window.alert(response.data ? response.data.meta.errorDetail : "Could not load data.");
        });
    }
});