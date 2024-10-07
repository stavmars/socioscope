import { ILang } from 'app/shared/model/language.interface';
import { IGeoMap } from './dimension.model';

export interface IDimensionCode {
  id?: string;
  dimensionId?: string;
  notation?: string;
  name?: ILang;
  shortName?: ILang;
  description?: ILang;
  parentId?: string;
  order?: number;
  color?: string;
  children?: IDimensionCode[];
  level?: number;
  iconURL?: string;
  disabled?: boolean;
  geoMaps?: IGeoMap[];
}

export const defaultValue: Readonly<IDimensionCode> = { name: {}, description: {} };
