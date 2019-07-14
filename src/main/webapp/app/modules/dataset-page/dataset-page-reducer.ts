import axios from 'axios';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeries } from 'app/shared/model/series.model';
import { ISeriesOptions } from 'app/shared/model/series-options.model';
import { IDimensionCode } from 'app/shared/model/dimension-code.model';
import { IDimension } from 'app/shared/model/dimension.model';
import _ from 'lodash';

export const ACTION_TYPES = {
  SET_DATASET: 'datasetPage/SET_DATASET',
  FETCH_SERIES: 'datasetPage/FETCH_SERIES',
  FETCH_DIMENSION_CODELIST: 'datasetPage/FETCH_DIMENSION_CODELIST',
  FETCH_DIMENSION_CODELISTS: 'datasetPage/FETCH_DIMENSION_CODELISTS',
  CHANGE_XAXIS: 'datasetPage/CHANGE_XAXIS',
  CHANGE_COMPARE_BY: 'datasetPage/CHANGE_COMPARE_BY',
  SET_FILTER_VALUE: 'datasetPage/SET_FILTER_VALUE',
  RESET_SERIES_OPTIONS: 'datasetPage/RESET_SERIES_OPTIONS'
};

const initialState = {
  loadingSeries: true,
  fetchedCodeLists: false,
  errorMessage: null,
  dimensionCodes: {} as any,
  seriesOptions: null as ISeriesOptions,
  seriesList: [] as ISeries[]
};

export type DatasetPageState = Readonly<typeof initialState>;

// Reducer
export default (state: DatasetPageState = initialState, action): DatasetPageState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_SERIES):
      return {
        ...state,
        loadingSeries: true
      };
    case FAILURE(ACTION_TYPES.FETCH_SERIES):
      return {
        ...state,
        loadingSeries: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_SERIES):
      return {
        ...state,
        seriesList: action.payload.data,
        loadingSeries: false
      };
    case SUCCESS(ACTION_TYPES.FETCH_DIMENSION_CODELIST):
      return {
        ...state,
        dimensionCodes: {
          ...state.dimensionCodes,
          [action.payload.dimensionId]: {
            codes: action.payload.codelist,
            codesByNotation: _.keyBy(action.payload.codelist, 'notation')
          }
        }
      };
    case SUCCESS(ACTION_TYPES.FETCH_DIMENSION_CODELISTS):
      return {
        ...state,
        fetchedCodeLists: true
      };
    case ACTION_TYPES.CHANGE_XAXIS:
      return {
        ...state,
        seriesOptions: {
          ...state.seriesOptions,
          xAxis: action.payload,
          compareBy: null
        }
      };
    case ACTION_TYPES.CHANGE_COMPARE_BY:
      return {
        ...state,
        seriesOptions: {
          ...state.seriesOptions,
          compareBy: action.payload
        }
      };
    case ACTION_TYPES.SET_FILTER_VALUE:
      return {
        ...state,
        seriesOptions: {
          ...state.seriesOptions,
          dimensionFilters: {
            ...state.seriesOptions.dimensionFilters,
            [action.payload.dimensionId]: action.payload.filterValue
          }
        }
      };
    case ACTION_TYPES.RESET_SERIES_OPTIONS:
      return {
        ...state,
        seriesOptions: action.payload
      };
    default:
      return {
        ...state
      };
  }
};

const datasetApiUrl = 'api/data-sets';
const dimensionApiUrl = 'api/dimensions';

// Actions

/*export const getDataset = (id: string) => async dispatch => {
  const requestUrl = `${datasetApiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.FETCH_DATASET,
    payload: axios.get<IDataSet>(requestUrl)
  });
  dispatch(getDimensionCodeLists(result.value.data));
  return result;
};*/

export const getDimensionCodelist = (dimension: IDimension) => ({
  type: ACTION_TYPES.FETCH_DIMENSION_CODELIST,
  payload: axios
    .get<IDimensionCode>(`${dimensionApiUrl}/${dimension.id}/codelist`)
    .then(res => ({ dimensionId: dimension.id, codelist: res.data }))
});

export const getDimensionCodeLists = (dataset: IDataSet) => dispatch => {
  const promises = Promise.all(dataset.dimensions.map(dimension => dispatch(getDimensionCodelist(dimension))));
  return dispatch({
    type: ACTION_TYPES.FETCH_DIMENSION_CODELISTS,
    payload: promises
  });
};

export const getSeries = (id, seriesOptions: ISeriesOptions) => {
  const requestUrl = `${datasetApiUrl}/${id}/series`;
  return {
    type: ACTION_TYPES.FETCH_SERIES,
    payload: axios.post(requestUrl, seriesOptions)
  };
};

export const changeXAxis = (xAxis: string) => (dispatch, getState) => {
  dispatch({
    type: ACTION_TYPES.CHANGE_XAXIS,
    payload: xAxis
  });
  const { seriesOptions } = getState().datasetPage;
  dispatch(getSeries('greek-election-results', seriesOptions));
};

export const setFilterValue = (dataset: IDataSet, dimensionId: string, filterValue: string) => (dispatch, getState) => {
  dispatch({
    type: ACTION_TYPES.SET_FILTER_VALUE,
    payload: { dimensionId, filterValue }
  });
  const { seriesOptions } = getState().datasetPage;
  dispatch(getSeries(dataset.id, seriesOptions));
};

export const changeCompareBy = (compareBy: string) => ({
  type: ACTION_TYPES.CHANGE_COMPARE_BY,
  payload: compareBy
});

export const resetSeriesOptions = (dataset: IDataSet) => (dispatch, getState) => {
  const { dimensionCodes } = getState().datasetPage;
  const { dimensions } = dataset;
  const xAxis = dimensions[0].id;
  let seriesOptions;
  if (dataset.type === 'qb') {
    const dimensionFilters = {};
    for (let i = 1; i < dimensions.length; i++) {
      const dimension = dimensions[i];
      dimensionFilters[dimension.id] = dimensionCodes[dimension.id].codes[0].notation;
    }
    seriesOptions = { xAxis, dimensionFilters };
  } else {
    seriesOptions = { xAxis };
  }
  dispatch({
    type: ACTION_TYPES.RESET_SERIES_OPTIONS,
    payload: seriesOptions
  });
  dispatch(getSeries(dataset.id, seriesOptions));
};

export const initVis = (dataset: IDataSet) => async dispatch => {
  await dispatch(getDimensionCodeLists(dataset));
  dispatch(resetSeriesOptions(dataset));
};
