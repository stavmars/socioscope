import { ILang } from 'app/shared/model/language.interface';

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
}

export const defaultValue: Readonly<IDimensionCode> = { name: {}, description: {} };
