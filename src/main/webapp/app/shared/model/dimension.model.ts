import { IUser } from 'app/shared/model/user.model';
import { ILang } from 'app/shared/model/language.interface';

export interface IDimension {
  id?: string;
  name?: ILang;
  type?: string;
  creator?: IUser;
}

export const defaultValue: Readonly<IDimension> = { name: {} };
