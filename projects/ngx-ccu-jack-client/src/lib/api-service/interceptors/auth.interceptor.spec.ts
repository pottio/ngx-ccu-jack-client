import { CcuJackApiService } from './../ccu-jack-api.service';
import { CcuJackClientConfiguration } from '../../shared';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { getApiServiceTestModuleForConfig } from '../ccu-jack-api.service.spec';

describe('AuthInterceptor', () => {
  describe('intercept', () => {
    test.each`
      user      | password      | expectAuthHeader
      ${null}   | ${null}       | ${false}
      ${'user'} | ${'password'} | ${true}
    `('should add "Authorization" header depending on the configuration', ({ user, password, expectAuthHeader }) => {
      // arrange
      TestBed.configureTestingModule(
        getApiServiceTestModuleForConfig({
          hostnameOrIp: 'hostname',
          port: 2122,
          secureConnection: true,
          auth:
            !user || !password
              ? null
              : {
                  user: user,
                  password: password
                },
          connectMqttOnInit: true
        } as CcuJackClientConfiguration)
      );
      const service = TestBed.inject(CcuJackApiService);
      const httpMock = TestBed.inject(HttpTestingController);

      // act
      service.getVendorInformation().subscribe((response) => {
        expect(response).toBeTruthy();
      });

      // assert
      const httpRequest = httpMock.expectOne(`https://hostname:2122/~vendor`);
      expect(httpRequest.request.headers.has('Authorization')).toEqual(expectAuthHeader);
    });
  });
});
