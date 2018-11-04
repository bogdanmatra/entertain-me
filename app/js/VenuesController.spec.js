'use strict';

describe('VenuesController', function () {
    beforeEach(module('entertain-me'));

    var $controller, $rootScope, $injector, $q;

    beforeEach(inject(function (_$controller_, _$rootScope_, _$injector_, _$q_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $injector = _$injector_;
        $q = _$q_;
    }));

    describe('updateVenues', function () {
        it('calls the method `getVenues` from the FoursquareAPIService', function () {
            // Mocks.
            var mockVenueList = ['venue1', 'venue2'];
            var $scope = $rootScope.$new();
            $scope.initialCoordinates = "1,1";
            $controller('VenuesController', {$scope: $scope});

            var mockFoursquareAPIService = $injector.get('FoursquareAPIService');
            var deferred = $q.defer();
            deferred.resolve(mockVenueList);
            mockFoursquareAPIService.getVenues = jasmine.createSpy("getVenues").and.returnValue(deferred.promise);

            // Call tested function.
            $scope.updateVenues();

            expect(mockFoursquareAPIService.getVenues).toHaveBeenCalledWith({
                position: $scope.initialCoordinates,
                radius: '500',
                section: ''
            });
            deferred.promise.then(function () {
                expect($scope.loading).toEqual(false);
                expect($scope.venues).toBe(mockVenueList);
            });

        });
    });

    describe('noGeolocationSelectedHandler', function () {
        it('sets scope values accordingly when no geolocation is selected', function () {
            // Mocks.
            var $scope = $rootScope.$new();
            $controller('VenuesController', {$scope: $scope});
            $scope.formGeolocationAutocomplete = {};

            // Call tested function.
            $scope.noGeolocationSelectedHandler();

            expect($scope.venues).toEqual([]);
            expect($scope.moreFiltersDisabled).toBe(true);
            expect($scope.formGeolocationPlaceholder).toBe("Choose a place...");
        });
    });

    describe('controller initialization', function () {
        it("asks for user's geolocation, then if the user accepts, it gets the geolocation name", function () {
            // Mocks.
            var mockCoordinates = {latitude: 1, longitude: 1};
            var mockGeolocationService = $injector.get('GeolocationService');
            var deferred = $q.defer();
            deferred.resolve(mockCoordinates);
            mockGeolocationService.getCurrentGeolocationCoordinates =
                jasmine.createSpy("getCurrentGeolocationCoordinates").and.returnValue(deferred.promise);
            var deferred2 = $q.defer();
            deferred2.resolve();
            mockGeolocationService.getGeolocationName =
                jasmine.createSpy("getGeolocationName").and.returnValue(deferred2.promise);

            // Call tested function.
            var $scope = $rootScope.$new();
            $scope.updateVenues = jasmine.createSpy("updateVenues");
            $controller('VenuesController', {$scope: $scope});

            expect(mockGeolocationService.getCurrentGeolocationCoordinates).toHaveBeenCalled();
            deferred.promise.then(function () {
                expect($scope.initialCoordinates).toBe(mockCoordinates);
                expect($scope.moreFiltersDisabled).toBe(false);
                expect($scope.updateVenues).toHaveBeenCalled();
                expect(mockGeolocationService.getGeolocationName).toHaveBeenCalledWith(mockCoordinates);
            })

        });
    });

    describe('controller initialization', function () {
        it("asks for user's geolocation, then if the user does NOT accept, it sets scope variables accordingly", function () {
            // Mocks.
            var mockGeolocationService = $injector.get('GeolocationService');
            var deferred = $q.defer();
            deferred.reject();
            mockGeolocationService.getCurrentGeolocationCoordinates =
                jasmine.createSpy("getCurrentGeolocationCoordinates").and.returnValue(deferred.promise);

            // Call tested function.
            var $scope = $rootScope.$new();
            $controller('VenuesController', {$scope: $scope});

            expect(mockGeolocationService.getCurrentGeolocationCoordinates).toHaveBeenCalled();
            deferred.promise.then(function () {
                expect($scope.loading).toBe(false);
            })

        });
    });

    describe('controller initialization', function () {
        it("sets scope variable defaults", function () {
            // Call tested function.
            var $scope = $rootScope.$new();
            $controller('VenuesController', {$scope: $scope});

            expect($scope.initialGeolocationChanged).toBe(false);
            expect($scope.formGeolocationRadius).toBe('500');
            expect($scope.formVenueType).toBe("");
            expect($scope.formGeolocationPlaceholder).toBe("Choose a place...");
            expect($scope.moreFiltersDisabled).toBe(true);
        });
    });

});