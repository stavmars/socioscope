import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { INewsPost, defaultValue } from 'app/shared/model/news-post.model';

export const ACTION_TYPES = {
  SEARCH_NEWSPOSTS: 'newsPost/SEARCH_NEWSPOSTS',
  FETCH_NEWSPOST_LIST: 'newsPost/FETCH_NEWSPOST_LIST',
  FETCH_NEWSPOST: 'newsPost/FETCH_NEWSPOST',
  CREATE_NEWSPOST: 'newsPost/CREATE_NEWSPOST',
  UPDATE_NEWSPOST: 'newsPost/UPDATE_NEWSPOST',
  DELETE_NEWSPOST: 'newsPost/DELETE_NEWSPOST',
  SET_BLOB: 'newsPost/SET_BLOB',
  RESET: 'newsPost/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<INewsPost>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type NewsPostState = Readonly<typeof initialState>;

// Reducer

export default (state: NewsPostState = initialState, action): NewsPostState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_NEWSPOSTS):
    case REQUEST(ACTION_TYPES.FETCH_NEWSPOST_LIST):
    case REQUEST(ACTION_TYPES.FETCH_NEWSPOST):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_NEWSPOST):
    case REQUEST(ACTION_TYPES.UPDATE_NEWSPOST):
    case REQUEST(ACTION_TYPES.DELETE_NEWSPOST):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_NEWSPOSTS):
    case FAILURE(ACTION_TYPES.FETCH_NEWSPOST_LIST):
    case FAILURE(ACTION_TYPES.FETCH_NEWSPOST):
    case FAILURE(ACTION_TYPES.CREATE_NEWSPOST):
    case FAILURE(ACTION_TYPES.UPDATE_NEWSPOST):
    case FAILURE(ACTION_TYPES.DELETE_NEWSPOST):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_NEWSPOSTS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_NEWSPOST_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_NEWSPOST):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_NEWSPOST):
    case SUCCESS(ACTION_TYPES.UPDATE_NEWSPOST):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_NEWSPOST):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.SET_BLOB:
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType
        }
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/news-posts';
const apiSearchUrl = 'api/_search/news-posts';

// Actions

export const getSearchEntities: ICrudSearchAction<INewsPost> = query => ({
  type: ACTION_TYPES.SEARCH_NEWSPOSTS,
  payload: axios.get<INewsPost>(`${apiSearchUrl}?query=` + query)
});

export const getEntities: ICrudGetAllAction<INewsPost> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_NEWSPOST_LIST,
  payload: axios.get<INewsPost>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<INewsPost> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_NEWSPOST,
    payload: axios.get<INewsPost>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<INewsPost> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_NEWSPOST,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<INewsPost> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_NEWSPOST,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<INewsPost> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_NEWSPOST,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const setBlob = (name, data, contentType?) => ({
  type: ACTION_TYPES.SET_BLOB,
  payload: {
    name,
    data,
    contentType
  }
});

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
