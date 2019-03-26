import { IDataSet } from 'app/shared/model//data-set.model';

export interface IMeasure {
  id?: string;
  name?: string;
  unit?: string;
  dataset?: IDataSet;
}

export const defaultValue: Readonly<IMeasure> = {};
