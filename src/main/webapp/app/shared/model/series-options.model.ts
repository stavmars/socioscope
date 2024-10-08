export interface IDimensionFilters {
  [dimensionId: string]: string;
}

export interface ISeriesOptions {
  xAxis?: string;
  compareBy?: string;
  compareCodes?: string[];
  dimensionFilters?: IDimensionFilters;
  measure?: string;
}

export const defaultValue: Readonly<ISeriesOptions> = { dimensionFilters: {}, compareCodes: [] };
