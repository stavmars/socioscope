import { IUser } from 'app/shared/model/user.model';
import { ILang } from 'app/shared/model/language.interface';

export interface IDimension {
  id?: string;
  name?: ILang;
  type?: string;
  creator?: IUser;
  geoMaps?: IGeoMap[];
}

export interface IGeoMap {
  name: ILang;
  url: string;
  level: number;
}

export const defaultValue: Readonly<IDimension> = { name: {} };
