import { ISeriesOptions } from 'app/shared/model/series-options.model';
import { ILang } from './language.interface';

export interface IHighlight {
  id?: string;
  description?: ILang;
  seriesOptions?: ISeriesOptions;
  level?: number;
  visType?: string;
  subType?: string;
}

export const defaultValue: Readonly<IHighlight> = { description: {} };
