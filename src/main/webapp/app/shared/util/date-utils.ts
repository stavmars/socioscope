import moment from 'moment';

import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export const convertDateTimeFromServer = date => (date ? moment(date).format(APP_LOCAL_DATE_FORMAT) : null);
