'use strict';

describe('VenuesController', function () {
    beforeEach(module('entertain-me'));

    var $controller, $rootScope, $injector, $q;

    beforeEach(inject(function (_$controller_, _$rootScope_, _$injector_, _$q_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $injector = _$injector_
        $q = _$q_;
    }));

    describe('updateVenues', function () {
        it('calls the method `getVenues` from the FoursquareAPIService', function () {
            var $scope = $rootScope.$new();
            $scope.initialCoordinates = "1,1";
            $controller('VenuesController', {$scope: $scope});

            var mockFoursquareAPIService = $injector.get('FoursquareAPIService');
            var deferred = $q.defer();
            deferred.resolve();
            mockFoursquareAPIService.getVenues = jasmine.createSpy("getVenues").and.returnValue(deferred.promise);

            $scope.updateVenues();
            expect(mockFoursquareAPIService.getVenues).toHaveBeenCalledWith({
                position: '1,1',
                radius: '500',
                section: ''
            });
        });
    });
});