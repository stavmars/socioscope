import { ISeriesPoint } from 'app/shared/model/series-point.model';

export interface ISeries {
  id?: string;
  color?: string;
  data?: ISeriesPoint[];
}

export const defaultValue: Readonly<ISeries> = {};
