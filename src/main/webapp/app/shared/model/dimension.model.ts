import { IUser } from 'app/shared/model/user.model';
import { IDataSet } from 'app/shared/model//data-set.model';

export interface IDimension {
  id?: string;
  name?: string;
  type?: string;
  creator?: IUser;
  dataset?: IDataSet;
}

export const defaultValue: Readonly<IDimension> = {};
