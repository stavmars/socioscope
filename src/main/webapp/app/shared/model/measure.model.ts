import { IUser } from 'app/shared/model/user.model';

export interface IMeasure {
  id?: string;
  name?: string;
  unit?: string;
  creator?: IUser;
}

export const defaultValue: Readonly<IMeasure> = {};
