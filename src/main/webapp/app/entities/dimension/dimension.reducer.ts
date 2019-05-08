import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IDimension, defaultValue } from 'app/shared/model/dimension.model';

export const ACTION_TYPES = {
  SEARCH_DIMENSIONS: 'dimension/SEARCH_DIMENSIONS',
  FETCH_DIMENSION_LIST: 'dimension/FETCH_DIMENSION_LIST',
  FETCH_DIMENSION: 'dimension/FETCH_DIMENSION',
  CREATE_DIMENSION: 'dimension/CREATE_DIMENSION',
  UPDATE_DIMENSION: 'dimension/UPDATE_DIMENSION',
  DELETE_DIMENSION: 'dimension/DELETE_DIMENSION',
  RESET: 'dimension/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IDimension>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type DimensionState = Readonly<typeof initialState>;

// Reducer

export default (state: DimensionState = initialState, action): DimensionState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_DIMENSIONS):
    case REQUEST(ACTION_TYPES.FETCH_DIMENSION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_DIMENSION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_DIMENSION):
    case REQUEST(ACTION_TYPES.UPDATE_DIMENSION):
    case REQUEST(ACTION_TYPES.DELETE_DIMENSION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_DIMENSIONS):
    case FAILURE(ACTION_TYPES.FETCH_DIMENSION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_DIMENSION):
    case FAILURE(ACTION_TYPES.CREATE_DIMENSION):
    case FAILURE(ACTION_TYPES.UPDATE_DIMENSION):
    case FAILURE(ACTION_TYPES.DELETE_DIMENSION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_DIMENSIONS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_DIMENSION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_DIMENSION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_DIMENSION):
    case SUCCESS(ACTION_TYPES.UPDATE_DIMENSION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_DIMENSION):
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

const apiUrl = 'api/dimensions';
const apiSearchUrl = 'api/_search/dimensions';

// Actions

export const getSearchEntities: ICrudSearchAction<IDimension> = query => ({
  type: ACTION_TYPES.SEARCH_DIMENSIONS,
  payload: axios.get<IDimension>(`${apiSearchUrl}?query=` + query)
});

export const getEntities: ICrudGetAllAction<IDimension> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_DIMENSION_LIST,
  payload: axios.get<IDimension>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IDimension> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_DIMENSION,
    payload: axios.get<IDimension>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IDimension> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_DIMENSION,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IDimension> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_DIMENSION,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IDimension> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_DIMENSION,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
