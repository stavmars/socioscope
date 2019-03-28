import { IUser } from 'app/shared/model/user.model';
import { IDataSet } from 'app/shared/model//data-set.model';

export interface IMeasure {
  id?: string;
  name?: string;
  unit?: string;
  creator?: IUser;
  dataset?: IDataSet;
}

export const defaultValue: Readonly<IMeasure> = {};
