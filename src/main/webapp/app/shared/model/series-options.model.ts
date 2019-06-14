import { IDimensionValue } from 'app/shared/model/dimension-value';

export interface ISeriesOptions {
  xAxis?: string;
  compareBy?: string;
  dimensionValues?: IDimensionValue[];
  measure?: string;
}
