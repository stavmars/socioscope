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
  geoMaps?: { [key: string]: IGeoMap };
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
  defaultGeoMapXAxis?: boolean;
  geoMapDependency?: string;
  defaultGeoMapKey?: string;
}

export interface IGeoMap {
  name: ILang;
  url: string;
}

export const defaultValue: Readonly<IDimension> = { name: {} };
