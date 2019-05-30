import { IUser } from 'app/shared/model/user.model';

interface ILang {
  el?: string;
  en?: string;
}

export interface IDimension {
  id?: string;
  name?: ILang;
  type?: string;
  creator?: IUser;
}

export const defaultValue: Readonly<IDimension> = {};
