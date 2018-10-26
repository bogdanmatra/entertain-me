var app = angular.module("entertain-me", []);

app.constant('FoursquareConstants', {
    ENDPOINT: "https://api.foursquare.com/",
    VERSION: "v2",
    CLIENT_ID: "P1OHINAXZITW5Y1RX45ZPFCJ1R5ZZP5GFBGWL5GOZGMOK0WL",
    CLIENT_SECRET: "Y1XMOG02U0ZRUVNZWJCKMLKLHLL3VT2BBZ0ZAJLVE4CE2XQP",
    VERSIONING: "20181026",
    COORDINATE_SEPARATOR: ",",
    VENUES_EXPLORE: "/venues/explore"

});

app.service('FoursquareAPI', function ($http, FoursquareConstants,) {
    this.getVenues = function (position) {
        return $http({
            url: FoursquareConstants.ENDPOINT + FoursquareConstants.VERSION + FoursquareConstants.VENUES_EXPLORE,
            method: "GET",
            params: {
                client_id: FoursquareConstants.CLIENT_ID,
                client_secret: FoursquareConstants.CLIENT_SECRET,
                v: FoursquareConstants.VERSIONING,
                near: position.coords.latitude + FoursquareConstants.COORDINATE_SEPARATOR + position.coords.longitude
            }
        }).then(function (response) {
            return response.data.response.groups[0].items.map(function (item) {
                return item.venue;
            });
        });
    }
});

app.controller('VenuesController', function ($window, FoursquareAPI, $scope) {
    $window.navigator.geolocation.watchPosition(function (position) {
        FoursquareAPI.getVenues(position).then(function (venues) {
            $scope.venues = venues;
        })
    }, function (error) {
        alert(error.message);
    });
});