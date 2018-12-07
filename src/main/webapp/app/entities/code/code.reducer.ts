import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ICode, defaultValue } from 'app/shared/model/code.model';

export const ACTION_TYPES = {
  SEARCH_CODES: 'code/SEARCH_CODES',
  FETCH_CODE_LIST: 'code/FETCH_CODE_LIST',
  FETCH_CODE: 'code/FETCH_CODE',
  CREATE_CODE: 'code/CREATE_CODE',
  UPDATE_CODE: 'code/UPDATE_CODE',
  DELETE_CODE: 'code/DELETE_CODE',
  RESET: 'code/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ICode>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type CodeState = Readonly<typeof initialState>;

// Reducer

export default (state: CodeState = initialState, action): CodeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_CODES):
    case REQUEST(ACTION_TYPES.FETCH_CODE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CODE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_CODE):
    case REQUEST(ACTION_TYPES.UPDATE_CODE):
    case REQUEST(ACTION_TYPES.DELETE_CODE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_CODES):
    case FAILURE(ACTION_TYPES.FETCH_CODE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CODE):
    case FAILURE(ACTION_TYPES.CREATE_CODE):
    case FAILURE(ACTION_TYPES.UPDATE_CODE):
    case FAILURE(ACTION_TYPES.DELETE_CODE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_CODES):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_CODE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_CODE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_CODE):
    case SUCCESS(ACTION_TYPES.UPDATE_CODE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_CODE):
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

const apiUrl = 'api/codes';
const apiSearchUrl = 'api/_search/codes';

// Actions

export const getSearchEntities: ICrudSearchAction<ICode> = query => ({
  type: ACTION_TYPES.SEARCH_CODES,
  payload: axios.get<ICode>(`${apiSearchUrl}?query=` + query)
});

export const getEntities: ICrudGetAllAction<ICode> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_CODE_LIST,
  payload: axios.get<ICode>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<ICode> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CODE,
    payload: axios.get<ICode>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ICode> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CODE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ICode> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CODE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<ICode> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CODE,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
