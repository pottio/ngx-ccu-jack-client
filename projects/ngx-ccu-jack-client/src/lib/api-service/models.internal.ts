import { AdditionalPropertiesSupport } from '../shared/models.internal';

export interface CcuJackResultWithLinks extends AdditionalPropertiesSupport {
  '~links'?: CcuJackLink[];
}

export interface CcuJackLink {
  href: string;
  title: string;
  rel: string;
}
