// Maps adapter to Angular: https://github.com/jvandemo/angularjs-google-maps
var app = angular.module("entertain-me", ['gm']);

app.constant('FoursquareConstants', {
    ENDPOINT: "https://api.foursquare.com/",
    VERSION: "v2",
    CLIENT_ID: "P1OHINAXZITW5Y1RX45ZPFCJ1R5ZZP5GFBGWL5GOZGMOK0WL",
    CLIENT_SECRET: "Y1XMOG02U0ZRUVNZWJCKMLKLHLL3VT2BBZ0ZAJLVE4CE2XQP",
    VERSIONING: "20181026",
    COORDINATE_SEPARATOR: ",",
    VENUES_EXPLORE: "/venues/explore"

});

app.service('FoursquareAPI', function ($http, FoursquareConstants) {
    this.getVenues = function (position) {
        return $http({
            url: FoursquareConstants.ENDPOINT + FoursquareConstants.VERSION + FoursquareConstants.VENUES_EXPLORE,
            method: "GET",
            params: {
                client_id: FoursquareConstants.CLIENT_ID,
                client_secret: FoursquareConstants.CLIENT_SECRET,
                v: FoursquareConstants.VERSIONING,
                ll: position.latitude + FoursquareConstants.COORDINATE_SEPARATOR + position.longitude
            }
        }).then(function (response) {
            return response.data.response.groups[0].items.map(function (item) {
                return item.venue;
            });
        }).catch(function (response) {
            alert(response.data.meta.errorDetail);
        });
    }
});


app.controller('VenuesController', function ($scope, $window, FoursquareAPI) {
    $scope.updateVenues = function (position) {
        FoursquareAPI.getVenues(position).then(function (venues) {
            $scope.venues = venues;
        })
    };

    $scope.$on('gmPlacesAutocomplete::placeChanged', function () {
        $scope.venues = [];
        var newGeolocation = $scope.geolocationAutocomplete.getPlace().geometry.location;
        $scope.updateVenues({
            latitude: newGeolocation.lat(),
            longitude: newGeolocation.lng()
        });
    });

    $window.navigator.geolocation.getCurrentPosition(function (position) {
        $scope.updateVenues(position.coords);
    }, function (error) {
        alert(error.message);
    });
});