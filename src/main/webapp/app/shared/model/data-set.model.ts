import { IDimension } from 'app/shared/model//dimension.model';
import { IMeasure } from 'app/shared/model//measure.model';
import { IUser } from 'app/shared/model/user.model';
import { IHighlight } from 'app/shared/model/highlight.model';
import { Moment } from 'moment';
import { ILang } from 'app/shared/model/language.interface';

export interface IDataSet {
  id?: string;
  name?: ILang;
  type?: string;
  comment?: ILang;
  sources?: ILang;
  createdDate?: Moment;
  dimensions?: IDimension[];
  measures?: IMeasure[];
  highlights?: IHighlight[];
  creator?: IUser;
  colorScheme?: string;
}

export const defaultValue: Readonly<IDataSet> = { name: {}, comment: {}, sources: {} };
