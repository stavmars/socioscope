import { IDimension } from 'app/shared/model//dimension.model';
import { IMeasure } from 'app/shared/model//measure.model';
import { IUser } from 'app/shared/model/user.model';

export interface IDataSet {
  id?: string;
  name?: string;
  type?: string;
  comment?: string;
  dimensions?: IDimension[];
  measures?: IMeasure[];
  creator?: IUser;
}

export const defaultValue: Readonly<IDataSet> = {};
