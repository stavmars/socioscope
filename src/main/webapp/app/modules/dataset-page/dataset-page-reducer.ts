import axios from 'axios';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { IDataSet } from 'app/shared/model/data-set.model';
import { ISeries } from 'app/shared/model/series.model';
import { IDimensionFilters, ISeriesOptions } from 'app/shared/model/series-options.model';
import { IDimension } from 'app/shared/model/dimension.model';
import _ from 'lodash';
import { unflattenDimensionCodes } from 'app/shared/util/entity-utils';
import qs from 'qs';
import { IDimensionCode } from 'app/shared/model/dimension-code.model';

export interface IVisOptions {
  visType: string;
  subType?: string;
  seriesOptions: ISeriesOptions;
}

export const ACTION_TYPES = {
  INIT_VIS: 'datasetPage/INIT_VIS',
  FETCH_SERIES: 'datasetPage/FETCH_SERIES',
  FETCH_DIMENSION_CODELISTS: 'datasetPage/FETCH_DIMENSION_CODELISTS',
  UPDATE_VIS_OPTIONS: 'datasetPage/UPDATE_VIS_OPTIONS',
  TOGGLE_COMPARE_VALUE: 'datasetPage/TOGGLE_COMPARE_VALUE',
  UPDATE_CODE_STATUS: 'datasetPage/UPDATE_CODE_STATUS',
  FETCH_VALID_CODES: 'datasetPage/FETCH_VALID_CODES'
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
    case REQUEST(ACTION_TYPES.FETCH_DIMENSION_CODELISTS):
      return {
        ...state,
        fetchedCodeLists: false,
        loadingSeries: true
      };
    case SUCCESS(ACTION_TYPES.FETCH_DIMENSION_CODELISTS):
      return {
        ...state,
        dimensionCodes: action.payload,
        fetchedCodeLists: true
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
    case SUCCESS(ACTION_TYPES.UPDATE_CODE_STATUS):
      return {
        ...state,
        dimensionCodes: { ...state.dimensionCodes, [action.payload.dimensionId]: action.payload.codes },
        fetchedCodeLists: true
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

export const fetchValidCodes = (dataset: IDataSet, dimensionId, otherDimensionId, otherDimensionValue) => (dispatch, getState) => {
  const { dimensionCodes } = getState().datasetPage;
  return dispatch({
    type: ACTION_TYPES.FETCH_VALID_CODES,
    payload: axios
      .get(`${datasetApiUrl}/${dataset.id}/validCodes`, { params: { dimensionId, otherDimensionId, otherDimensionValue } })
      .then(res => {
        const validCodes = res.data;
        dimensionCodes[dimensionId].codes.forEach((code: IDimensionCode) => (code.disabled = !validCodes.includes(code.notation)));
        dispatch({
          type: ACTION_TYPES.UPDATE_CODE_STATUS,
          payload: { dimensionId, codes: dimensionCodes[dimensionId] }
        });
      })
  });
};

export const resetCodeStatus = (dataset: IDataSet, dimensionId) => (dispatch, getState) => {
  const { dimensionCodes } = getState().datasetPage;
  dimensionCodes[dimensionId].codes.forEach((code: IDimensionCode) => (code.disabled = false));
  return {
    type: ACTION_TYPES.UPDATE_CODE_STATUS,
    payload: { dimensionId, codes: dimensionCodes[dimensionId] }
  };
};

export const setFilterValue = (dataset: IDataSet, dimensionId: string, filterValue: string) => (dispatch, getState) => {
  const { visType, seriesOptions } = getState().datasetPage;
  const filters = { ...seriesOptions.dimensionFilters };
  if (filterValue == null) {
    const dimension = dataset.dimensions.find(dim => dim.id === dimensionId);
    if (dimension.type === 'combined') {
      dimension.composedOf && dimension.composedOf.forEach(subDim => (filters[subDim] = null));
    } else {
      filters[dimensionId] = null;
    }
  } else {
    filters[dimensionId] = filterValue;
    const superDimension = dataset.dimensions.find(
      dim => dim.type === 'combined' && dim.composedOf && dim.composedOf.includes(dimensionId)
    );
    if (superDimension) {
      superDimension.composedOf.forEach(subDim => subDim !== dimensionId && (filters[subDim] = null));
    }
  }
  dispatch(
    updateVisOptions(dataset, {
      visType,
      seriesOptions: {
        ...seriesOptions,
        dimensionFilters: filters
      }
    })
  );
};

export const removeFilter = (dataset: IDataSet, dimensionId: string) => (dispatch, getState) => {
  const { visType, seriesOptions } = getState().datasetPage;
  dispatch(
    updateVisOptions(dataset, {
      visType,
      seriesOptions: {
        ...seriesOptions,
        dimensionFilters: _.omit(seriesOptions.dimensionFilters, dimensionId)
      }
    })
  );
};

export const removeCompare = (dataset: IDataSet) => (dispatch, getState) => {
  const { visType, seriesOptions } = getState().datasetPage;
  dispatch(updateVisOptions(dataset, { visType, seriesOptions: { ...seriesOptions, compareBy: null, compareCodes: [] } }));
};

export const changeCompareBy = (dataset: IDataSet, compareBy: string) => (dispatch, getState) => {
  const { visType, seriesOptions } = getState().datasetPage;
  dispatch(updateVisOptions(dataset, { visType, seriesOptions: { ...seriesOptions, compareBy, compareCodes: [] } }));
};

export const updateVisOptions = (dataset: IDataSet, visOptions: IVisOptions) => async (dispatch, getState) => {
  const { dimensionCodes, seriesOptions: oldSeriesOptions } = getState().datasetPage;
  const { visType = 'chart', seriesOptions } = visOptions;
  let { subType } = visOptions;

  const { dimensions } = dataset;
  let { xAxis, compareBy, measure } = seriesOptions;
  const { compareCodes } = seriesOptions;
  let xAxisDimension: IDimension;
  const filters = { ...seriesOptions.dimensionFilters };
  if (visType === 'map') {
    xAxisDimension = dimensions.find(dim => dim.type === 'geographic-area');
    xAxis = xAxisDimension.id;
    compareBy = null;
  } else {
    xAxis = xAxis || dimensions[0].id;
    xAxisDimension = dimensions.find(dim => dim.id === xAxis);
  }

  subType = xAxisDimension.type === 'coded' || xAxisDimension.type === 'composite' ? subType || 'column' : null;

  measure = measure || dataset.measures[0].id;

  // if undefined, the corresponding dropdown is not being cleared
  compareBy = compareBy || null;
  const compareByDimension = dimensions.find(dim => dim.id === compareBy);

  const composedXAxisParent = dataset.dimensions.find(dim => dim.type === 'combined' && dim.composedOf && dim.composedOf.includes(xAxis));
  const composedCompareParent =
    compareBy != null && dataset.dimensions.find(dim => dim.type === 'combined' && dim.composedOf && dim.composedOf.includes(compareBy));

  const arr = [xAxis, compareBy];
  composedXAxisParent && arr.push(...composedXAxisParent.composedOf);
  composedCompareParent && arr.push(...composedCompareParent.composedOf);

  let newSeriesOptions = {};
  let dimensionFilters;
  if (dataset.type === 'qb') {
    if (arr.includes('elections') || !filters['elections']) {
      dispatch(resetCodeStatus(dataset, 'party'));
      dispatch(resetCodeStatus(dataset, 'constituency'));
    } else if (oldSeriesOptions && oldSeriesOptions.dimensionFilters['elections'] !== filters['elections']) {
      await dispatch(fetchValidCodes(dataset, 'party', 'elections', filters['elections']));
      await dispatch(fetchValidCodes(dataset, 'constituency', 'elections', filters['elections']));
    }

    dimensions.filter(dim => dim.type === 'combined').forEach(superDim => {
      if (!superDim.composedOf || superDim.composedOf.length === 0) {
        return;
      }
      let selectedSubDim = superDim.composedOf.find(subDim => filters[subDim] != null);
      if (!selectedSubDim && superDim.required && superDim.composedOf) {
        selectedSubDim = superDim.composedOf[0];
        filters[selectedSubDim] = dimensionCodes[selectedSubDim].codes.find(code => !code.disabled).notation;
      }
      selectedSubDim &&
        superDim.composedOf.forEach(subDim => {
          if (subDim !== selectedSubDim) {
            filters[subDim] = null;
          }
        });
    });

    dimensionFilters = dimensions
      .filter(dimension => !arr.includes(dimension.id) && dimension.type !== 'combined')
      .reduce((acc, dimension) => {
        acc[dimension.id] =
          dimension.parentDimensionId && ([xAxis, compareBy].includes(dimension.parentDimensionId) || !filters[dimension.parentDimensionId])
            ? null
            : filters[dimension.id] || null;

        if (acc[dimension.id] != null && dimensionCodes[dimension.id].codesByNotation[acc[dimension.id]].disabled) {
          acc[dimension.id] = null;
        }

        if (acc[dimension.id] == null && dimension.required) {
          const validCode = dimensionCodes[dimension.id].codes.find(code => !code.disabled);
          acc[dimension.id] = validCode.notation;
        }
        return acc;
      }, {}) as IDimensionFilters;

    if (arr.includes('constituency') || !dimensionFilters['constituency']) {
      dispatch(resetCodeStatus(dataset, 'municipality'));
    } else if (oldSeriesOptions && oldSeriesOptions.dimensionFilters['constituency'] !== dimensionFilters['constituency']) {
      dimensionFilters['municipality'] = null;
      await dispatch(fetchValidCodes(dataset, 'municipality', 'constituency', dimensionFilters['constituency']));
    }

    newSeriesOptions = { xAxis, compareBy, measure, dimensionFilters, compareCodes };
  } else {
    dimensionFilters = _.pickBy(filters, (value, key) => key !== xAxis && key !== compareBy);
    const dependencies = _.union(xAxisDimension.dependencies, compareByDimension ? compareByDimension.dependencies : []);
    dependencies.forEach(dep => {
      if (dep !== xAxis && dep !== compareBy && !dimensionFilters[dep]) {
        const depCodes = dimensionCodes[dep].codes;
        dimensionFilters[dep] = depCodes[depCodes.length - 1].notation;
      }
    });
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
