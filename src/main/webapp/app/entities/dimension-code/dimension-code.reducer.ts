import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IDimensionCode, defaultValue } from 'app/shared/model/dimension-code.model';

export const ACTION_TYPES = {
  SEARCH_DIMENSIONCODES: 'dimensionCode/SEARCH_DIMENSIONCODES',
  FETCH_DIMENSIONCODE_LIST: 'dimensionCode/FETCH_DIMENSIONCODE_LIST',
  FETCH_DIMENSIONCODE: 'dimensionCode/FETCH_DIMENSIONCODE',
  CREATE_DIMENSIONCODE: 'dimensionCode/CREATE_DIMENSIONCODE',
  UPDATE_DIMENSIONCODE: 'dimensionCode/UPDATE_DIMENSIONCODE',
  DELETE_DIMENSIONCODE: 'dimensionCode/DELETE_DIMENSIONCODE',
  RESET: 'dimensionCode/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IDimensionCode>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type DimensionCodeState = Readonly<typeof initialState>;

// Reducer

export default (state: DimensionCodeState = initialState, action): DimensionCodeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_DIMENSIONCODES):
    case REQUEST(ACTION_TYPES.FETCH_DIMENSIONCODE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_DIMENSIONCODE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_DIMENSIONCODE):
    case REQUEST(ACTION_TYPES.UPDATE_DIMENSIONCODE):
    case REQUEST(ACTION_TYPES.DELETE_DIMENSIONCODE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_DIMENSIONCODES):
    case FAILURE(ACTION_TYPES.FETCH_DIMENSIONCODE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_DIMENSIONCODE):
    case FAILURE(ACTION_TYPES.CREATE_DIMENSIONCODE):
    case FAILURE(ACTION_TYPES.UPDATE_DIMENSIONCODE):
    case FAILURE(ACTION_TYPES.DELETE_DIMENSIONCODE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_DIMENSIONCODES):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_DIMENSIONCODE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_DIMENSIONCODE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_DIMENSIONCODE):
    case SUCCESS(ACTION_TYPES.UPDATE_DIMENSIONCODE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_DIMENSIONCODE):
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

const apiUrl = 'api/dimension-codes';
const apiSearchUrl = 'api/_search/dimension-codes';

// Actions

export const getSearchEntities: ICrudSearchAction<IDimensionCode> = query => ({
  type: ACTION_TYPES.SEARCH_DIMENSIONCODES,
  payload: axios.get<IDimensionCode>(`${apiSearchUrl}?query=` + query)
});

export const getEntities: ICrudGetAllAction<IDimensionCode> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_DIMENSIONCODE_LIST,
  payload: axios.get<IDimensionCode>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IDimensionCode> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_DIMENSIONCODE,
    payload: axios.get<IDimensionCode>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IDimensionCode> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_DIMENSIONCODE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IDimensionCode> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_DIMENSIONCODE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IDimensionCode> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_DIMENSIONCODE,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
