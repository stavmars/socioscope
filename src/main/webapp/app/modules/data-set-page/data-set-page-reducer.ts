import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IDataSet, defaultValue } from 'app/shared/model/data-set.model';
import { ICrudGetAction, ICrudGetAllAction } from 'react-jhipster';
import { ISeries, defaultValue as seriesDefaultValue } from 'app/shared/model/series.model';
import { ISeriesOptions } from 'app/shared/model/series-options.model';

export const ACTION_TYPES = {
  FETCH_DATASET: 'dataSetPage/FETCH_DATASET',
  FETCH_DATASET_SERIES: 'dataSetPage/FETCH_DATASET_SERIES'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entity: defaultValue,
  series: seriesDefaultValue
};

export type DataSetPageState = Readonly<typeof initialState>;

// Reducer
export default (state: DataSetPageState = initialState, action): DataSetPageState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_DATASET):
    case REQUEST(ACTION_TYPES.FETCH_DATASET_SERIES):
      return {
        ...state,
        loading: true
      };
    case FAILURE(ACTION_TYPES.FETCH_DATASET):
    case FAILURE(ACTION_TYPES.FETCH_DATASET_SERIES):
      return {
        ...state,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_DATASET):
      return {
        ...state,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_DATASET_SERIES):
      return {
        ...state,
        series: action.payload.data
      };
    default:
      return {
        ...state
      };
  }
};

const apiUrl = 'api/data-sets';

// Actions

export const getEntity: ICrudGetAction<IDataSet> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_DATASET,
    payload: axios.get<IDataSet>(requestUrl)
  };
};

export const getSeries = (id, seriesOptions: ISeriesOptions[]) => {
  const requestUrl = `${apiUrl}/${id}/series`;
  return {
    type: ACTION_TYPES.FETCH_DATASET_SERIES,
    payload: axios.get<ISeries>(requestUrl, {
      params: seriesOptions
    })
  };
};
