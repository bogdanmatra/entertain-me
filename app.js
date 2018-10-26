var app = angular.module("entertain-me", []);


window.navigator.geolocation.watchPosition(function (position) {
    console.log(position);
});