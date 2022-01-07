import {
  CcuDeviceChannelReference,
  CcuDeviceDataPointReference,
  CcuDeviceReference,
  CcuFunctionReference,
  CcuProgramReference,
  CcuReferenceType,
  CcuRoomReference,
  CcuSysVarReference,
  CcuType
} from '../shared/models.public';
import { AdditionalPropertiesSupport } from '../shared/models.internal';
import { CcuJackResultWithLinks } from './models.internal';

export abstract class Transform {
  public static resultToResultWithoutLinks(result: CcuJackResultWithLinks): AdditionalPropertiesSupport {
    delete result['~links'];
    return result;
  }

  public static resultLinksToReferences(
    result: CcuJackResultWithLinks,
    linkType: CcuType,
    parentReference?: CcuReferenceType
  ): CcuReferenceType[] {
    const filteredLinks = (result['~links'] ?? []).filter((link) => link.rel === linkType);
    switch (linkType) {
      case 'device':
        return filteredLinks.map<CcuDeviceReference>((link) => {
          return { deviceAddress: link.href, title: link.title };
        });
      case 'channel':
        return filteredLinks.map<CcuDeviceChannelReference>((link) => {
          if (link.href.startsWith('/')) {
            const hrefSplit = `${link.href}`.split('/');
            return { deviceAddress: hrefSplit[2], channelAddress: hrefSplit[3], title: link.title };
          }
          return {
            deviceAddress: (<CcuDeviceReference>parentReference).deviceAddress,
            channelAddress: link.href,
            title: link.title
          };
        });
      case 'parameter':
        return filteredLinks.map<CcuDeviceDataPointReference>((link) => {
          return {
            deviceAddress: (<CcuDeviceChannelReference>parentReference).deviceAddress,
            channelAddress: (<CcuDeviceChannelReference>parentReference).channelAddress,
            dataPointAddress: link.href,
            title: link.title
          };
        });
      case 'function':
        return filteredLinks.map<CcuFunctionReference>((link) => {
          if (link.href.startsWith('/')) {
            const hrefSplit = `${link.href}`.split('/');
            return { functionAddress: hrefSplit[2], title: link.title };
          }
          return { functionAddress: link.href, title: link.title };
        });
      case 'program':
        return filteredLinks.map<CcuProgramReference>((link) => {
          return { programAddress: link.href, title: link.title };
        });
      case 'sysvar':
        return filteredLinks.map<CcuSysVarReference>((link) => {
          return { sysVarAddress: link.href, title: link.title };
        });
      case 'room':
        return filteredLinks.map<CcuRoomReference>((link) => {
          if (link.href.startsWith('/')) {
            const hrefSplit = `${link.href}`.split('/');
            return { roomAddress: hrefSplit[2], title: link.title };
          }
          return { roomAddress: link.href, title: link.title };
        });
    }
    return [];
  }

  public static valueToUrlParam<T>(value: T): string {
    return `${value}`.replace(/\s/g, '+');
  }

  public static customUrl(url: string): string {
    return url.startsWith('/') ? url : `/${url}`;
  }
}
