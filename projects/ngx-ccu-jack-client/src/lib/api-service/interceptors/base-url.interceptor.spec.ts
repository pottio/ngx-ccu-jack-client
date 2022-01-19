import { CcuJackApiService } from './../ccu-jack-api.service';
import { CcuJackClientConfiguration } from '../../shared';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { getApiServiceTestModuleForConfig } from '../ccu-jack-api.service.spec';

describe('BaseUrlInterceptor', () => {
  describe('intercept', () => {
    test.each`
      hostname      | port    | secureConnection | expectedBaseUrl
      ${'ccu'}      | ${2121} | ${false}         | ${'http://ccu:2121'}
      ${'hostname'} | ${2121} | ${false}         | ${'http://hostname:2121'}
      ${'hostname'} | ${2122} | ${false}         | ${'http://hostname:2122'}
      ${'hostname'} | ${2122} | ${true}          | ${'https://hostname:2122'}
    `(
      'should prepend correct base url depending on the configuration',
      ({ hostname, port, secureConnection, expectedBaseUrl }) => {
        // arrange
        TestBed.configureTestingModule(
          getApiServiceTestModuleForConfig({
            hostnameOrIp: hostname,
            port: port,
            secureConnection: secureConnection,
            auth: {
              user: 'user',
              password: 'password'
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
        expect(httpMock.expectOne(`${expectedBaseUrl}/~vendor`)).toBeDefined();
      }
    );
  });
});
