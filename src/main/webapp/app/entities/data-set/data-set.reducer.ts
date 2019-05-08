import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IDataSet, defaultValue } from 'app/shared/model/data-set.model';
import { IDimension } from 'app/shared/model/dimension.model';
import { IMeasure } from 'app/shared/model/measure.model';
import dimension from 'app/entities/dimension/dimension';

export const ACTION_TYPES = {
  SEARCH_DATASETS: 'dataSet/SEARCH_DATASETS',
  FETCH_DATASET_LIST: 'dataSet/FETCH_DATASET_LIST',
  FETCH_DATASET: 'dataSet/FETCH_DATASET',
  CREATE_DATASET: 'dataSet/CREATE_DATASET',
  UPDATE_DATASET: 'dataSet/UPDATE_DATASET',
  REMOVE_DIMENSION: 'dataSet/REMOVE_DIMENSION',
  REMOVE_MEASURE: 'dataSet/REMOVE_MEASURE',
  DELETE_DATASET: 'dataSet/DELETE_DATASET',
  RESET: 'dataSet/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IDataSet>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type DataSetState = Readonly<typeof initialState>;

// Reducer

export default (state: DataSetState = initialState, action): DataSetState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_DATASETS):
    case REQUEST(ACTION_TYPES.FETCH_DATASET_LIST):
    case REQUEST(ACTION_TYPES.FETCH_DATASET):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_DATASET):
    case REQUEST(ACTION_TYPES.UPDATE_DATASET):
    case REQUEST(ACTION_TYPES.REMOVE_DIMENSION):
    case REQUEST(ACTION_TYPES.REMOVE_MEASURE):
    case REQUEST(ACTION_TYPES.DELETE_DATASET):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_DATASETS):
    case FAILURE(ACTION_TYPES.FETCH_DATASET_LIST):
    case FAILURE(ACTION_TYPES.FETCH_DATASET):
    case FAILURE(ACTION_TYPES.CREATE_DATASET):
    case FAILURE(ACTION_TYPES.UPDATE_DATASET):
    case FAILURE(ACTION_TYPES.REMOVE_DIMENSION):
    case FAILURE(ACTION_TYPES.REMOVE_MEASURE):
    case FAILURE(ACTION_TYPES.DELETE_DATASET):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_DATASETS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_DATASET_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_DATASET):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_DATASET):
    case SUCCESS(ACTION_TYPES.UPDATE_DATASET):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.REMOVE_DIMENSION):
    case SUCCESS(ACTION_TYPES.REMOVE_MEASURE):
      return {
        ...state,
        updating: false,
        updateSuccess: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_DATASET):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/data-sets';
const apiSearchUrl = 'api/_search/data-sets';

// Actions

export const getSearchEntities: ICrudSearchAction<IDataSet> = query => ({
  type: ACTION_TYPES.SEARCH_DATASETS,
  payload: axios.get<IDataSet>(`${apiSearchUrl}?query=` + query)
});

export const getEntities: ICrudGetAllAction<IDataSet> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_DATASET_LIST,
  payload: axios.get<IDataSet>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IDataSet> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_DATASET,
    payload: axios.get<IDataSet>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IDataSet> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_DATASET,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IDataSet> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_DATASET,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const removeDimension = (dataSetId, dimensionId) => async dispatch => {
  const requestUrl = `${apiUrl}/${dataSetId}/dimension/${dimensionId}`;
  const result = await dispatch({
    type: ACTION_TYPES.REMOVE_DIMENSION,
    payload: axios.put(requestUrl)
  });
  return result;
};

export const removeMeasure = (dataSetId, measureId) => async dispatch => {
  const requestUrl = `${apiUrl}/${dataSetId}/measure/${measureId}`;
  const result = await dispatch({
    type: ACTION_TYPES.REMOVE_MEASURE,
    payload: axios.put(requestUrl)
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IDataSet> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_DATASET,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
