import axios from 'axios';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeries } from 'app/shared/model/series.model';
import { IDimensionFilters, ISeriesOptions } from 'app/shared/model/series-options.model';
import { IDimensionCode } from 'app/shared/model/dimension-code.model';
import { IDimension } from 'app/shared/model/dimension.model';
import _ from 'lodash';
import { unflattenDimensionCodes } from 'app/shared/util/entity-utils';
import dataSet from 'app/entities/data-set/data-set';

export interface IVisOptions {
  visType: string;
  seriesOptions: ISeriesOptions;
}

export const ACTION_TYPES = {
  FETCH_SERIES: 'datasetPage/FETCH_SERIES',
  FETCH_DIMENSION_CODELIST: 'datasetPage/FETCH_DIMENSION_CODELIST',
  FETCH_DIMENSION_CODELISTS: 'datasetPage/FETCH_DIMENSION_CODELISTS',
  CHANGE_COMPARE_BY: 'datasetPage/CHANGE_COMPARE_BY',
  SET_FILTER_VALUE: 'datasetPage/SET_FILTER_VALUE',
  UPDATE_VIS_OPTIONS: 'datasetPage/UPDATE_VIS_OPTIONS',
  TOGGLE_COMPARE_VALUE: 'datasetPage/TOGGLE_COMPARE_VALUE',
  REMOVE_FILTER: 'datasetPage/REMOVE_FILTER',
  ADD_CODE: 'datasetPage/ADD_CODE',
  REMOVE_CODE: 'datasetPage/REMOVE_CODE',
  REMOVE_COMPARE: 'datasetPage/REMOCE_COMPARE'
};

const initialState = {
  loadingSeries: true,
  fetchedCodeLists: false,
  errorMessage: null,
  dimensionCodes: {} as any,
  visType: 'chart',
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
    case SUCCESS(ACTION_TYPES.FETCH_DIMENSION_CODELISTS):
      return {
        ...state,
        fetchedCodeLists: true
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
    case ACTION_TYPES.REMOVE_FILTER:
      return {
        ...state,
        seriesOptions: {
          ...state.seriesOptions,
          dimensionFilters: _.omit(state.seriesOptions.dimensionFilters, action.payload.dimensionId)
        }
      };
    case ACTION_TYPES.ADD_CODE:
      return {
        ...state,
        seriesOptions: {
          ...state.seriesOptions,
          compareCodes: state.seriesOptions.compareCodes.concat([action.payload.code])
        }
      };
    case ACTION_TYPES.REMOVE_CODE:
      return {
        ...state,
        seriesOptions: {
          ...state.seriesOptions,
          compareCodes: _.filter(state.seriesOptions.compareCodes, el => el !== action.payload.code)
        }
      };
    case ACTION_TYPES.REMOVE_COMPARE:
      return {
        ...state,
        seriesOptions: {
          ...state.seriesOptions,
          compareBy: null as string,
          compareCodes: []
        }
      };
    case ACTION_TYPES.TOGGLE_COMPARE_VALUE:
      const { compareCode } = action.payload;
      const compareCodes = state.seriesOptions.compareCodes || [];
      return {
        ...state,
        seriesOptions: {
          ...state.seriesOptions,
          compareCodes: _.xor(compareCodes, [compareCode])
        }
      };
    case ACTION_TYPES.UPDATE_VIS_OPTIONS:
      return {
        ...state,
        visType: action.payload.visType,
        seriesOptions: action.payload.seriesOptions
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

export const setFilterValue = (dataset: IDataSet, dimensionId: string, filterValue: string) => (dispatch, getState) => {
  dispatch({
    type: ACTION_TYPES.SET_FILTER_VALUE,
    payload: { dimensionId, filterValue }
  });
  const { seriesOptions } = getState().datasetPage;
  dispatch(getSeries(dataset.id, seriesOptions));
};

export const removeFilter = (dataset: IDataSet, dimensionId: string) => (dispatch, getState) => {
  dispatch({
    type: ACTION_TYPES.REMOVE_FILTER,
    payload: { dimensionId }
  });
  const { seriesOptions } = getState().datasetPage;
  dispatch(getSeries(dataset.id, seriesOptions));
};

export const addCode = (dataset: IDataSet, code: string) => (dispatch, getState) => {
  dispatch({
    type: ACTION_TYPES.ADD_CODE,
    payload: { code }
  });
  const { seriesOptions } = getState().datasetPage;
  dispatch(getSeries(dataset.id, seriesOptions));
};

export const removeCode = (dataset: IDataSet, code: string) => (dispatch, getState) => {
  dispatch({
    type: ACTION_TYPES.REMOVE_CODE,
    payload: { code }
  });
  const { seriesOptions } = getState().datasetPage;
  dispatch(getSeries(dataset.id, seriesOptions));
};

export const removeCompare = (dataset: IDataSet) => (dispatch, getState) => {
  dispatch({
    type: ACTION_TYPES.REMOVE_COMPARE
  });
  const { seriesOptions } = getState().datasetPage;
  dispatch(getSeries(dataset.id, seriesOptions));
};

export const toggleCompareValue = (dataset: IDataSet, dimensionId: string, compareCode: string) => (dispatch, getState) => {
  const { seriesOptions, visType } = getState().datasetPage;
  if (seriesOptions.compareBy === dimensionId) {
    dispatch({
      type: ACTION_TYPES.TOGGLE_COMPARE_VALUE,
      payload: { compareCode }
    });
    const { seriesOptions: updatedSeriesOptions } = getState().datasetPage;

    dispatch(getSeries(dataset.id, updatedSeriesOptions));
  } else {
    dispatch(
      updateVisOptions(dataset, {
        visType,
        seriesOptions: { ...seriesOptions, compareBy: dimensionId, compareCodes: [compareCode] }
      })
    );
  }
};

export const updateVisOptions = (dataset: IDataSet, visOptions: IVisOptions) => (dispatch, getState) => {
  const { dimensionCodes } = getState().datasetPage;
  const { visType = 'chart', seriesOptions } = visOptions;
  const { dimensions } = dataset;
  const { compareCodes } = seriesOptions;
  let { xAxis, compareBy, measure } = seriesOptions;
  const filters = seriesOptions.dimensionFilters || {};
  if (visType === 'map') {
    xAxis = dimensions.find(dim => dim.type === 'geographic-area').id;
    compareBy = null;
  } else {
    xAxis = xAxis || dimensions[0].id;
  }

  measure = measure || dataset.measures[0].id;

  let newSeriesOptions = {};
  if (dataset.type === 'qb') {
    const dimensionFilters = dimensions.filter(dimension => ![xAxis, compareBy].includes(dimension.id)).reduce((acc, dimension) => {
      acc[dimension.id] = filters[dimension.id] || dimensionCodes[dimension.id].codes[0].notation;
      return acc;
    }, {}) as IDimensionFilters;
    newSeriesOptions = { xAxis, compareBy, measure, dimensionFilters, compareCodes };
  } else {
    newSeriesOptions = { xAxis, compareBy, measure, dimensionFilters: filters || {}, compareCodes };
  }
  dispatch({
    type: ACTION_TYPES.UPDATE_VIS_OPTIONS,
    payload: { visType, seriesOptions: newSeriesOptions }
  });
  dispatch(getSeries(dataset.id, newSeriesOptions));
};

export const initVis = (dataset: IDataSet, visOptions: IVisOptions) => async dispatch => {
  await dispatch(getDimensionCodeLists(dataset));
  dispatch(updateVisOptions(dataset, visOptions));
};
