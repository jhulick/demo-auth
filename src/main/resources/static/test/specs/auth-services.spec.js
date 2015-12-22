'use strict';

describe('auth services ', function () {

    beforeEach(angular.mock.module('blocks.auth'));

    describe('Auth', function () {

        var $httpBackend, spiedLocalStorageService, authService, spiedAuthServerProvider;

        beforeEach(inject(function($injector, localStorageService, Auth, AuthServerProvider) {
            $httpBackend = $injector.get('$httpBackend');

            spiedLocalStorageService = localStorageService;
            authService = Auth;
            spiedAuthServerProvider = AuthServerProvider;

            //Request on app init
            $httpBackend.expectPOST(/api\/logout/).respond(200, '');
            $httpBackend.expectGET(/api\/account/).respond({});
            
          })
        );

        it('should call backend on logout then call authServerProvider.logout', function() {

            //GIVEN
            //Set spy
            sinon.spy(spiedAuthServerProvider, 'logout');
            sinon.spy(spiedLocalStorageService, "clearAll");

            //WHEN
            authService.logout();
            //flush the backend to "execute" the request to do the expectedGET assertion.
            $httpBackend.flush();

            //THEN
            expect(spiedAuthServerProvider.logout.calledOnce).to.be.true;
            expect(spiedLocalStorageService.clearAll.calledOnce).to.be.true;
        });

    });
});
