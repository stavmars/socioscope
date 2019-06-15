import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IDataSet, defaultValue } from 'app/shared/model/data-set.model';
import { ICrudGetAction } from 'react-jhipster';
import { ISeries, defaultValue as seriesDefaultValue } from 'app/shared/model/series.model';
import { ISeriesOptions } from 'app/shared/model/series-options.model';

export const ACTION_TYPES = {
  FETCH_DATASET: 'datasetPage/FETCH_DATASET',
  FETCH_SERIES: 'datasetPage/FETCH_SERIES'
};

const initialState = {
  loadingDataset: false,
  loadingSeries: false,
  errorMessage: null,
  dataset: defaultValue,
  series: seriesDefaultValue
};

export type DatasetPageState = Readonly<typeof initialState>;

// Reducer
export default (state: DatasetPageState = initialState, action): DatasetPageState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_DATASET):
      return {
        ...state,
        loadingDataset: true
      };
    case REQUEST(ACTION_TYPES.FETCH_SERIES):
      return {
        ...state,
        loadingSeries: true
      };
    case FAILURE(ACTION_TYPES.FETCH_DATASET):
    case FAILURE(ACTION_TYPES.FETCH_SERIES):
      return {
        ...state,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_DATASET):
      return {
        ...state,
        dataset: action.payload.data,
        loadingDataset: false
      };
    case SUCCESS(ACTION_TYPES.FETCH_SERIES):
      return {
        ...state,
        series: action.payload.data,
        loadingSeries: true
      };
    default:
      return {
        ...state
      };
  }
};

const apiUrl = 'api/data-sets';

// Actions

export const getDataset: ICrudGetAction<IDataSet> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_DATASET,
    payload: axios.get<IDataSet>(requestUrl)
  };
};

export const getSeries = (id, seriesOptions: ISeriesOptions[]) => {
  const requestUrl = `${apiUrl}/${id}/series`;
  return {
    type: ACTION_TYPES.FETCH_SERIES,
    payload: axios.get<ISeries>(requestUrl, {
      params: seriesOptions
    })
  };
};
