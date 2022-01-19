import {
  CcuDeviceChannelReference,
  CcuDeviceDataPointReference,
  CcuDeviceReference,
  CcuFunctionReference,
  CcuProgramReference
} from '../shared';
import { CcuRoomReference, CcuSysVarReference } from './../shared/models.public';
import { CcuJackResultWithLinks } from './models.internal';
import { Transform } from './transformation';

describe('Transform', () => {
  const sut = Transform;

  describe('resultToResultWithoutLinks', () => {
    test('should transform CcuJackResultWithLinks to object without links', () => {
      // arrange
      const ccuJackResultWithLinks: CcuJackResultWithLinks = {
        '~links': [
          {
            title: 'title',
            href: 'href',
            rel: 'type'
          }
        ]
      };

      // act
      const transformedObject = sut.resultToResultWithoutLinks(ccuJackResultWithLinks);

      // assert
      expect(transformedObject['~links']).toBeUndefined();
    });
  });

  describe('resultLinksToReferences', () => {
    test('should transform all device links from CcuJackResultWithLinks to array of CcuReferenceType', () => {
      // arrange
      const ccuJackResultWithLinks: CcuJackResultWithLinks = {
        '~links': [
          {
            title: 'title',
            href: 'device0',
            rel: 'device'
          }
        ]
      };

      // act
      const referenceTypes = sut.resultLinksToReferences(ccuJackResultWithLinks, 'device');

      // assert
      expect(referenceTypes.length).toBe(1);
      expect((referenceTypes[0] as CcuDeviceReference).deviceAddress).toEqual('device0');
      expect((referenceTypes[0] as CcuDeviceReference).title).toEqual('title');
    });

    test('should transform all channel links from CcuJackResultWithLinks of device parent to array of CcuReferenceType', () => {
      // arrange
      const ccuJackResultWithLinks: CcuJackResultWithLinks = {
        '~links': [
          {
            title: 'title',
            href: 'channel0',
            rel: 'channel'
          }
        ]
      };
      const parentReference: CcuDeviceReference = {
        deviceAddress: 'device0'
      };

      // act
      const referenceTypes = sut.resultLinksToReferences(ccuJackResultWithLinks, 'channel', parentReference);

      // assert
      expect(referenceTypes.length).toBe(1);
      expect((referenceTypes[0] as CcuDeviceChannelReference).deviceAddress).toEqual('device0');
      expect((referenceTypes[0] as CcuDeviceChannelReference).channelAddress).toEqual('channel0');
      expect((referenceTypes[0] as CcuDeviceChannelReference).title).toEqual('title');
    });

    test('should transform all channel links from CcuJackResultWithLinks with deep href to array of CcuReferenceType', () => {
      // arrange
      const ccuJackResultWithLinks: CcuJackResultWithLinks = {
        '~links': [
          {
            title: 'title',
            href: '/device/device0/channel0',
            rel: 'channel'
          }
        ]
      };

      // act
      const referenceTypes = sut.resultLinksToReferences(ccuJackResultWithLinks, 'channel');

      // assert
      expect(referenceTypes.length).toBe(1);
      expect((referenceTypes[0] as CcuDeviceChannelReference).deviceAddress).toEqual('device0');
      expect((referenceTypes[0] as CcuDeviceChannelReference).channelAddress).toEqual('channel0');
      expect((referenceTypes[0] as CcuDeviceChannelReference).title).toEqual('title');
    });

    test('should transform all parameter links from CcuJackResultWithLinks of device channel parent to array of CcuReferenceType', () => {
      // arrange
      const ccuJackResultWithLinks: CcuJackResultWithLinks = {
        '~links': [
          {
            title: 'title',
            href: 'parameter0',
            rel: 'parameter'
          }
        ]
      };
      const parentReference: CcuDeviceChannelReference = {
        deviceAddress: 'device0',
        channelAddress: 'channel0'
      };

      // act
      const referenceTypes = sut.resultLinksToReferences(ccuJackResultWithLinks, 'parameter', parentReference);

      // assert
      expect(referenceTypes.length).toBe(1);
      expect((referenceTypes[0] as CcuDeviceDataPointReference).deviceAddress).toEqual('device0');
      expect((referenceTypes[0] as CcuDeviceDataPointReference).channelAddress).toEqual('channel0');
      expect((referenceTypes[0] as CcuDeviceDataPointReference).dataPointAddress).toEqual('parameter0');
      expect((referenceTypes[0] as CcuDeviceDataPointReference).title).toEqual('title');
    });

    test('should transform all function links from CcuJackResultWithLinks to array of ReferenceType', () => {
      // arrange
      const ccuJackResultWithLinks: CcuJackResultWithLinks = {
        '~links': [
          {
            title: 'title',
            href: 'function0',
            rel: 'function'
          }
        ]
      };

      // act
      const referenceTypes = sut.resultLinksToReferences(ccuJackResultWithLinks, 'function');

      // assert
      expect(referenceTypes.length).toBe(1);
      expect((referenceTypes[0] as CcuFunctionReference).functionAddress).toEqual('function0');
      expect((referenceTypes[0] as CcuFunctionReference).title).toEqual('title');
    });

    test('should transform all function links from CcuJackResultWithLinks with deep href to array of CcuReferenceType', () => {
      // arrange
      const ccuJackResultWithLinks: CcuJackResultWithLinks = {
        '~links': [
          {
            title: 'title',
            href: '/function/function0',
            rel: 'function'
          }
        ]
      };

      // act
      const referenceTypes = sut.resultLinksToReferences(ccuJackResultWithLinks, 'function');

      // assert
      expect(referenceTypes.length).toBe(1);
      expect((referenceTypes[0] as CcuFunctionReference).functionAddress).toEqual('function0');
      expect((referenceTypes[0] as CcuFunctionReference).title).toEqual('title');
    });

    test('should transform all program links from CcuJackResultWithLinks to array of CcuReferenceType', () => {
      // arrange
      const ccuJackResultWithLinks: CcuJackResultWithLinks = {
        '~links': [
          {
            title: 'title',
            href: 'program0',
            rel: 'program'
          }
        ]
      };

      // act
      const referenceTypes = sut.resultLinksToReferences(ccuJackResultWithLinks, 'program');

      // assert
      expect(referenceTypes.length).toBe(1);
      expect((referenceTypes[0] as CcuProgramReference).programAddress).toEqual('program0');
      expect((referenceTypes[0] as CcuProgramReference).title).toEqual('title');
    });

    test('should transform all sysvar links from CcuJackResultWithLinks to array of CcuReferenceType', () => {
      // arrange
      const ccuJackResultWithLinks: CcuJackResultWithLinks = {
        '~links': [
          {
            title: 'title',
            href: 'sysvar0',
            rel: 'sysvar'
          }
        ]
      };

      // act
      const referenceTypes = sut.resultLinksToReferences(ccuJackResultWithLinks, 'sysvar');

      // assert
      expect(referenceTypes.length).toBe(1);
      expect((referenceTypes[0] as CcuSysVarReference).sysVarAddress).toEqual('sysvar0');
      expect((referenceTypes[0] as CcuSysVarReference).title).toEqual('title');
    });

    test('should transform all room links from CcuJackResultWithLinks to array of CcuReferenceType', () => {
      // arrange
      const ccuJackResultWithLinks: CcuJackResultWithLinks = {
        '~links': [
          {
            title: 'title',
            href: 'room0',
            rel: 'room'
          }
        ]
      };

      // act
      const referenceTypes = sut.resultLinksToReferences(ccuJackResultWithLinks, 'room');

      // assert
      expect(referenceTypes.length).toBe(1);
      expect((referenceTypes[0] as CcuRoomReference).roomAddress).toEqual('room0');
      expect((referenceTypes[0] as CcuRoomReference).title).toEqual('title');
    });

    test('should transform all room links from CcuJackResultWithLinks with deep href to array of CcuReferenceType', () => {
      // arrange
      const ccuJackResultWithLinks: CcuJackResultWithLinks = {
        '~links': [
          {
            title: 'title',
            href: '/room/room0',
            rel: 'room'
          }
        ]
      };

      // act
      const referenceTypes = sut.resultLinksToReferences(ccuJackResultWithLinks, 'room');

      // assert
      expect(referenceTypes.length).toBe(1);
      expect((referenceTypes[0] as CcuRoomReference).roomAddress).toEqual('room0');
      expect((referenceTypes[0] as CcuRoomReference).title).toEqual('title');
    });

    test('should transform all room links from CcuJackResultWithLinks with deep href to array of CcuReferenceType', () => {
      // arrange
      const ccuJackResultWithLinks: CcuJackResultWithLinks = {
        '~links': [
          {
            title: 'title',
            href: '/room/room0',
            rel: 'room'
          }
        ]
      };

      // act
      const referenceTypes = sut.resultLinksToReferences(ccuJackResultWithLinks, 'room');

      // assert
      expect(referenceTypes.length).toBe(1);
      expect((referenceTypes[0] as CcuRoomReference).roomAddress).toEqual('room0');
      expect((referenceTypes[0] as CcuRoomReference).title).toEqual('title');
    });

    test('should return empty array of CcuReferenceType for unknown link type', () => {
      // arrange
      const ccuJackResultWithLinks: CcuJackResultWithLinks = {
        '~links': []
      };

      // act
      const referenceTypes = sut.resultLinksToReferences(ccuJackResultWithLinks, 'root');

      // assert
      expect(referenceTypes.length).toBe(0);
    });

    test('should return empty array of CcuReferenceType if result has no links', () => {
      // arrange
      const ccuJackResultWithLinks: CcuJackResultWithLinks = {};

      // act
      const referenceTypes = sut.resultLinksToReferences(ccuJackResultWithLinks, 'room');

      // assert
      expect(referenceTypes.length).toBe(0);
    });
  });

  describe('valueToUrlParam', () => {
    it('should replace every white space in value with a plus character', () => {
      // arrange
      const value = 'My new value';

      // act
      const transformedParam = Transform.valueToUrlParam<string>(value);

      // assert
      expect(transformedParam).toEqual('My+new+value');
    });
  });

  describe('customUrl', () => {
    it('should not transform custom url starting with slash', () => {
      // arrange
      const myCustomPath = '/my/custom/path';

      // act
      const transformedPath = Transform.customUrl(myCustomPath);

      // assert
      expect(transformedPath).toEqual('/my/custom/path');
    });

    it('should transform custom url not starting with slash', () => {
      // arrange
      const myCustomPath = 'my/custom/path';

      // act
      const transformedPath = Transform.customUrl(myCustomPath);

      // assert
      expect(transformedPath).toEqual('/my/custom/path');
    });
  });
});
