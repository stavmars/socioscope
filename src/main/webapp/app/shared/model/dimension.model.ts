import { IUser } from 'app/shared/model/user.model';

export interface IDimension {
  id?: string;
  name?: string;
  type?: string;
  creator?: IUser;
}

export const defaultValue: Readonly<IDimension> = {};
