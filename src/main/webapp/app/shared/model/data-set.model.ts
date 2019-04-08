import { IDimension } from 'app/shared/model//dimension.model';
import { IMeasure } from 'app/shared/model//measure.model';
import { IUser } from 'app/shared/model/user.model';
import { Moment } from 'moment';

export interface IDataSet {
  id?: string;
  name?: string;
  type?: string;
  comment?: string;
  createdDate?: Moment;
  dimensions?: IDimension[];
  measures?: IMeasure[];
  creator?: IUser;
}

export const defaultValue: Readonly<IDataSet> = {};
