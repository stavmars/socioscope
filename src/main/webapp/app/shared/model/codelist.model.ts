import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';
import { ICode } from 'app/shared/model/code.model';

export interface ICodelist {
  id?: string;
  name?: string;
  description?: string;
  createdDate?: Moment;
  creator?: IUser;
  codes?: ICode[];
}

export const defaultValue: Readonly<ICodelist> = {};
