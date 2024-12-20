import { IUser } from 'app/shared/model/user.model';
import { ILang } from 'app/shared/model/language.interface';

export interface IDimension {
  id?: string;
  name?: ILang;
  description?: ILang;
  details?: ILang;
  groupId?: string;
  type?: string;
  order?: string;
  creator?: IUser;
  geoMaps?: IGeoMap[];
  dependencies?: string[];
  disableFilter?: boolean;
  disableCompareBy?: boolean;
  disableAxis?: boolean;
  disableStacking?: boolean;
  composedOf?: string[];
  allowCompareCodes?: boolean;
  filterWidget?: string;
  required?: boolean;
  noFilterText?: ILang;
  parentDimensionId?: string;
  allowThreshold?: boolean;
}

export interface IGeoMap {
  name: ILang;
  url: string;
  level: number;
}

export const defaultValue: Readonly<IDimension> = { name: {} };
