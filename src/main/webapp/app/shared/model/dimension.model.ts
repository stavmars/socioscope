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
  levels?: IDimensionLevel[];
  dependencies?: string[];
  disableFilter?: boolean;
  disableAxis?: boolean;
  disableStacking?: boolean;
  composedOf?: string[];
  filterWidget?: string;
}

export interface IDimensionLevel {
  name: ILang;
  mapUrl: string;
  depth: number;
}

export const defaultValue: Readonly<IDimension> = { name: {} };
