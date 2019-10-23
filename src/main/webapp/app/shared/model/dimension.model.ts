import { IUser } from 'app/shared/model/user.model';
import { ILang } from 'app/shared/model/language.interface';

export interface IDimension {
  id?: string;
  name?: ILang;
  description?: ILang;
  groupId?: string;
  type?: string;
  order?: string;
  creator?: IUser;
  geoMaps?: IGeoMap[];
  dependencies?: string[];
  disableFilter?: boolean;
  disableAxis?: boolean;
  composedOf?: string[];
  filterWidget?: string;
}

export interface IGeoMap {
  name: ILang;
  url: string;
  level: number;
}

export const defaultValue: Readonly<IDimension> = { name: {} };
