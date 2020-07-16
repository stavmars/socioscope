import { IUser } from 'app/shared/model/user.model';
import { ILang } from 'app/shared/model/language.interface';

export interface IMeasure {
  id?: string;
  name?: ILang;
  type?: string;
  unit?: string;
  decimalPlaces?: number;
  creator?: IUser;
}

export const defaultValue: Readonly<IMeasure> = { name: {} };
