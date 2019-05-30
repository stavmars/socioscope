import { IUser } from 'app/shared/model/user.model';

interface ILang {
  el?: string;
  en?: string;
}

export interface IMeasure {
  id?: string;
  name?: ILang;
  unit?: string;
  creator?: IUser;
}

export const defaultValue: Readonly<IMeasure> = {};
