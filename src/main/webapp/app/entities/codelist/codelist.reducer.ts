import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ICodelist, defaultValue } from 'app/shared/model/codelist.model';
import { ICode } from 'app/shared/model/code.model';

export const ACTION_TYPES = {
  SEARCH_CODELISTS: 'codelist/SEARCH_CODELISTS',
  FETCH_CODELIST_LIST: 'codelist/FETCH_CODELIST_LIST',
  FETCH_CODELIST: 'codelist/FETCH_CODELIST',
  CREATE_CODELIST: 'codelist/CREATE_CODELIST',
  UPDATE_CODELIST: 'codelist/UPDATE_CODELIST',
  DELETE_CODELIST: 'codelist/DELETE_CODELIST',
  CREATE_CODE: 'codelist/CREATE_CODE',
  UPDATE_CODE: 'codelist/UPDATE_CODE',
  DELETE_CODE: 'codelist/DELETE_CODE',
  RESET: 'codelist/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ICodelist>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type CodelistState = Readonly<typeof initialState>;

// Reducer

export default (state: CodelistState = initialState, action): CodelistState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_CODELISTS):
    case REQUEST(ACTION_TYPES.FETCH_CODELIST_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CODELIST):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_CODELIST):
    case REQUEST(ACTION_TYPES.UPDATE_CODELIST):
    case REQUEST(ACTION_TYPES.DELETE_CODELIST):
    case REQUEST(ACTION_TYPES.CREATE_CODE):
    case REQUEST(ACTION_TYPES.UPDATE_CODE):
    case REQUEST(ACTION_TYPES.DELETE_CODE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_CODELISTS):
    case FAILURE(ACTION_TYPES.FETCH_CODELIST_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CODELIST):
    case FAILURE(ACTION_TYPES.CREATE_CODELIST):
    case FAILURE(ACTION_TYPES.UPDATE_CODELIST):
    case FAILURE(ACTION_TYPES.DELETE_CODELIST):
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
    case SUCCESS(ACTION_TYPES.SEARCH_CODELISTS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_CODELIST_LIST):
      return {
        ...state,
        loading: false,
        totalItems: action.payload.headers['x-total-count'],
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_CODELIST):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_CODELIST):
    case SUCCESS(ACTION_TYPES.UPDATE_CODELIST):
    case SUCCESS(ACTION_TYPES.CREATE_CODE):
    case SUCCESS(ACTION_TYPES.UPDATE_CODE):
    case SUCCESS(ACTION_TYPES.DELETE_CODE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_CODELIST):
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

const apiUrl = 'api/codelists';
const apiSearchUrl = 'api/_search/codelists';

// Actions

export const getSearchEntities: ICrudSearchAction<ICodelist> = query => ({
  type: ACTION_TYPES.SEARCH_CODELISTS,
  payload: axios.get<ICodelist>(`${apiSearchUrl}?query=` + query)
});

export const getEntities: ICrudGetAllAction<ICodelist> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_CODELIST_LIST,
    payload: axios.get<ICodelist>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ICodelist> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CODELIST,
    payload: axios.get<ICodelist>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ICodelist> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CODELIST,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ICodelist> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CODELIST,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<ICodelist> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CODELIST,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const createCode = (code: ICode) => ({
  type: ACTION_TYPES.CREATE_CODE,
  payload: code
});

// export const

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
