import axios from 'axios';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeries } from 'app/shared/model/series.model';
import { IDimensionFilters, ISeriesOptions } from 'app/shared/model/series-options.model';
import { IDimension } from 'app/shared/model/dimension.model';
import _ from 'lodash';
import { unflattenDimensionCodes } from 'app/shared/util/entity-utils';
import qs from 'qs';

export interface IVisOptions {
  visType: string;
  subType?: string;
  seriesOptions: ISeriesOptions;
}

export const ACTION_TYPES = {
  INIT_VIS: 'datasetPage/INIT_VIS',
  FETCH_SERIES: 'datasetPage/FETCH_SERIES',
  FETCH_DIMENSION_CODELIST: 'datasetPage/FETCH_DIMENSION_CODELIST',
  FETCH_DIMENSION_CODELISTS: 'datasetPage/FETCH_DIMENSION_CODELISTS',
  SET_FILTER_VALUE: 'datasetPage/SET_FILTER_VALUE',
  UPDATE_VIS_OPTIONS: 'datasetPage/UPDATE_VIS_OPTIONS',
  TOGGLE_COMPARE_VALUE: 'datasetPage/TOGGLE_COMPARE_VALUE',
  REMOVE_FILTER: 'datasetPage/REMOVE_FILTER'
};

const initialState = {
  loadingSeries: true,
  fetchedCodeLists: false,
  updatingVisOptions: true,
  errorMessage: null,
  dimensionCodes: {} as any,
  visType: 'chart',
  subType: 'column',
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
            codes: unflattenDimensionCodes(action.payload.codelist),
            codesByNotation: _.keyBy(action.payload.codelist, 'notation')
          }
        }
      };
    case REQUEST(ACTION_TYPES.FETCH_DIMENSION_CODELISTS):
      return {
        ...state,
        fetchedCodeLists: false
      };
    case SUCCESS(ACTION_TYPES.FETCH_DIMENSION_CODELISTS):
      return {
        ...state,
        dimensionCodes: action.payload,
        fetchedCodeLists: true
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
    case ACTION_TYPES.REMOVE_FILTER:
      return {
        ...state,
        seriesOptions: {
          ...state.seriesOptions,
          dimensionFilters: _.omit(state.seriesOptions.dimensionFilters, action.payload.dimensionId)
        }
      };
    case ACTION_TYPES.INIT_VIS:
      return {
        ...state,
        updatingVisOptions: true
      };
    case ACTION_TYPES.UPDATE_VIS_OPTIONS:
      return {
        ...state,
        updatingVisOptions: false,
        visType: action.payload.visType,
        subType: action.payload.subType,
        seriesOptions: action.payload.seriesOptions
      };
    default:
      return {
        ...state
      };
  }
};

const datasetApiUrl = 'api/data-sets';

// Actions
export const getDimensionCodeLists = (dataSet: IDataSet) => ({
  type: ACTION_TYPES.FETCH_DIMENSION_CODELISTS,
  payload: axios.get(`${datasetApiUrl}/${dataSet.id}/codelists`).then(res => {
    let codesRequested = {};
    dataSet.dimensions.forEach(dimension => {
      codesRequested = {
        ...codesRequested,
        [dimension.id]: {
          codes: unflattenDimensionCodes(res.data[dimension.id]),
          codesByNotation: _.keyBy(res.data[dimension.id], 'notation')
        }
      };
    });
    return codesRequested;
  })
});

export const getSeries = id => (dispatch, getState) => {
  const { visType, subType, seriesOptions } = getState().datasetPage;
  history.pushState(null, null, getVisURL(id, { visType, subType, seriesOptions }));
  const requestUrl = `${datasetApiUrl}/${id}/series`;
  return dispatch({
    type: ACTION_TYPES.FETCH_SERIES,
    payload: axios.post(requestUrl, seriesOptions)
  });
};

export const setFilterValue = (dataset: IDataSet, dimensionId: string, filterValue: string) => (dispatch, getState) => {
  dispatch({
    type: ACTION_TYPES.SET_FILTER_VALUE,
    payload: { dimensionId, filterValue }
  });
  dispatch(getSeries(dataset.id));
};

export const removeFilter = (dataset: IDataSet, dimensionId: string) => (dispatch, getState) => {
  dispatch({
    type: ACTION_TYPES.REMOVE_FILTER,
    payload: { dimensionId }
  });
  dispatch(getSeries(dataset.id));
};

export const removeCompare = (dataset: IDataSet) => (dispatch, getState) => {
  const { visType, seriesOptions } = getState().datasetPage;
  dispatch(updateVisOptions(dataset, { visType, seriesOptions: { ...seriesOptions, compareBy: null } }));
};

export const changeCompareBy = (dataset: IDataSet, compareBy: string) => (dispatch, getState) => {
  const { visType, seriesOptions } = getState().datasetPage;
  dispatch(updateVisOptions(dataset, { visType, seriesOptions: { ...seriesOptions, compareBy } }));
};

export const updateVisOptions = (dataset: IDataSet, visOptions: IVisOptions) => (dispatch, getState) => {
  const { dimensionCodes } = getState().datasetPage;
  const { visType = 'chart', seriesOptions } = visOptions;
  let { subType } = visOptions;

  const { dimensions } = dataset;
  let { xAxis, compareBy, measure } = seriesOptions;
  let xAxisDimension: IDimension;
  const filters = seriesOptions.dimensionFilters || {};
  if (visType === 'map') {
    xAxisDimension = dimensions.find(dim => dim.type === 'geographic-area');
    xAxis = xAxisDimension.id;
    compareBy = null;
  } else {
    xAxis = xAxis || dimensions[0].id;
    xAxisDimension = dimensions.find(dim => dim.id === xAxis);
  }

  subType = xAxisDimension.type === 'coded' ? subType || 'column' : null;

  measure = measure || dataset.measures[0].id;

  // if undefined, the corresponding dropdown is not being cleared
  compareBy = compareBy || null;

  let newSeriesOptions = {};
  let dimensionFilters;
  if (dataset.type === 'qb') {
    dimensionFilters = dimensions.filter(dimension => ![xAxis, compareBy].includes(dimension.id)).reduce((acc, dimension) => {
      acc[dimension.id] = filters[dimension.id] || dimensionCodes[dimension.id].codes[0].notation;
      return acc;
    }, {}) as IDimensionFilters;
    newSeriesOptions = { xAxis, compareBy, measure, dimensionFilters };
  } else {
    dimensionFilters = _.pickBy(filters, (value, key) => key !== xAxis && key !== compareBy);
    newSeriesOptions = { xAxis, compareBy, measure, dimensionFilters };
  }
  dispatch({
    type: ACTION_TYPES.UPDATE_VIS_OPTIONS,
    payload: { visType, subType, seriesOptions: newSeriesOptions }
  });
  dispatch(getSeries(dataset.id));
};

export const initVis = (dataset: IDataSet, visOptions: IVisOptions) => async dispatch => {
  dispatch({
    type: ACTION_TYPES.INIT_VIS
  });
  await dispatch(getDimensionCodeLists(dataset));
  dispatch(updateVisOptions(dataset, visOptions));
};

export const urlEncodeVisOptions = (visOptions: IVisOptions) => {
  const { visType, subType, seriesOptions = {} } = visOptions;
  return qs.stringify(
    {
      type: visType,
      subType,
      x: seriesOptions.xAxis,
      compare: seriesOptions.compareBy,
      filters: seriesOptions.dimensionFilters,
      measure: seriesOptions.measure
    },
    { skipNulls: true }
  );
};

export const getVisURL = (datasetId: string, visOptions: IVisOptions) =>
  window.location.protocol + '//' + window.location.host + '/dataset/' + datasetId + '/data?' + urlEncodeVisOptions(visOptions);
