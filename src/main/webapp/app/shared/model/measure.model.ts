import { IUser } from 'app/shared/model/user.model';
import { ILang } from 'app/shared/model/language.interface';

export interface IMeasure {
  id?: string;
  name?: ILang;
  type?: string;
  unit?: string;
  decimalPlaces?: number;
  creator?: IUser;
  thresholdMin?: number;
  thresholdMax?: number;
  thresholdStep?: number;
  allowThreshold?: boolean;
  thresholdDependency?: string;
  thresholdAccumulator?: string;
}

export const defaultValue: Readonly<IMeasure> = { name: {} };
