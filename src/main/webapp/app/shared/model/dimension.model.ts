import { IDataSet } from 'app/shared/model//data-set.model';

export interface IDimension {
  id?: string;
  name?: string;
  type?: string;
  dataset?: IDataSet;
}

export const defaultValue: Readonly<IDimension> = {};
