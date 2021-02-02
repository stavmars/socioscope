import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IBlogPost, defaultValue } from 'app/shared/model/blog-post.model';

export const ACTION_TYPES = {
  FETCH_BLOGPOST_LIST: 'blogPost/FETCH_BLOGPOST_LIST',
  FETCH_BLOGPOST: 'blogPost/FETCH_BLOGPOST',
  CREATE_BLOGPOST: 'blogPost/CREATE_BLOGPOST',
  UPDATE_BLOGPOST: 'blogPost/UPDATE_BLOGPOST',
  DELETE_BLOGPOST: 'blogPost/DELETE_BLOGPOST',
  SET_BLOB: 'blogPost/SET_BLOB',
  RESET: 'blogPost/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IBlogPost>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type BlogPostState = Readonly<typeof initialState>;

// Reducer

export default (state: BlogPostState = initialState, action): BlogPostState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_BLOGPOST_LIST):
    case REQUEST(ACTION_TYPES.FETCH_BLOGPOST):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_BLOGPOST):
    case REQUEST(ACTION_TYPES.UPDATE_BLOGPOST):
    case REQUEST(ACTION_TYPES.DELETE_BLOGPOST):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_BLOGPOST_LIST):
    case FAILURE(ACTION_TYPES.FETCH_BLOGPOST):
    case FAILURE(ACTION_TYPES.CREATE_BLOGPOST):
    case FAILURE(ACTION_TYPES.UPDATE_BLOGPOST):
    case FAILURE(ACTION_TYPES.DELETE_BLOGPOST):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_BLOGPOST_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_BLOGPOST):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_BLOGPOST):
    case SUCCESS(ACTION_TYPES.UPDATE_BLOGPOST):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_BLOGPOST):
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

const apiUrl = 'api/blog-posts';

// Actions

export const getEntities: ICrudGetAllAction<IBlogPost> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_BLOGPOST_LIST,
  payload: axios.get<IBlogPost>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IBlogPost> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_BLOGPOST,
    payload: axios.get<IBlogPost>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IBlogPost> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_BLOGPOST,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IBlogPost> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_BLOGPOST,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IBlogPost> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_BLOGPOST,
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
