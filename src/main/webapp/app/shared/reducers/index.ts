import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import locale, { LocaleState } from './locale';
import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from 'app/modules/administration/administration.reducer';
import userManagement, { UserManagementState } from 'app/modules/administration/user-management/user-management.reducer';
import register, { RegisterState } from 'app/modules/account/register/register.reducer';
import activate, { ActivateState } from 'app/modules/account/activate/activate.reducer';
import password, { PasswordState } from 'app/modules/account/password/password.reducer';
import settings, { SettingsState } from 'app/modules/account/settings/settings.reducer';
import passwordReset, { PasswordResetState } from 'app/modules/account/password-reset/password-reset.reducer';
import dataSet, { DataSetState } from 'app/entities/data-set/data-set.reducer';
import dimension, { DimensionState } from 'app/entities/dimension/dimension.reducer';
import measure, { MeasureState } from 'app/entities/measure/measure.reducer';
import dimensionCode, { DimensionCodeState } from 'app/entities/dimension-code/dimension-code.reducer';
import datasetPage, { DatasetPageState } from 'app/modules/dataset-page/dataset-page-reducer';
import header, { HeaderState } from 'app/shared/reducers/header';
import highlights, { HighlightsState } from 'app/modules/highlights/highlights-reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export interface IRootState {
  readonly authentication: AuthenticationState;
  readonly locale: LocaleState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly userManagement: UserManagementState;
  readonly register: RegisterState;
  readonly activate: ActivateState;
  readonly passwordReset: PasswordResetState;
  readonly password: PasswordState;
  readonly settings: SettingsState;
  readonly dataSet: DataSetState;
  readonly dimension: DimensionState;
  readonly measure: MeasureState;
  readonly dimensionCode: DimensionCodeState;
  readonly datasetPage: DatasetPageState;
  readonly highlights: HighlightsState;
  readonly header: HeaderState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  locale,
  applicationProfile,
  administration,
  userManagement,
  register,
  activate,
  passwordReset,
  password,
  settings,
  dataSet,
  dimension,
  measure,
  dimensionCode,
  datasetPage,
  highlights,
  header,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar
});

export default rootReducer;
