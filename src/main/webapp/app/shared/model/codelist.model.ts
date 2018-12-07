import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';

export interface ICodelist {
  id?: string;
  name?: string;
  description?: string;
  createdDate?: Moment;
  creator?: IUser;
}

export const defaultValue: Readonly<ICodelist> = {};
