import { ISeriesOptions } from 'app/shared/model/series-options.model';

export interface IHighlight {
  id?: string;
  description?: string;
  seriesOptions?: ISeriesOptions;
  level?: number;
  visType?: string;
}
