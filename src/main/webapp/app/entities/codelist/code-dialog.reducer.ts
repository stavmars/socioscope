import { ICode } from 'app/shared/model/code.model';

export const ACTION_TYPES = {
  ADD_ROW: 'codelist/codes/ADD_ROW',
  INSERT_TABLE: 'codelist/codes/INSERT_TABLE',
  DELETE_ROW: 'codelist/codes/DELETE_ROW'
};

const initialState = {
  codes: [] as ICode[],
  rows: 0,
  errorMessage: null,
  loading: false,
  updating: false,
  updateSuccess: false
};

export type CodeState = Readonly<typeof initialState>;

// Reducer

export default (state: CodeState = initialState, action): CodeState => {
  switch (action.type) {
    case ACTION_TYPES.ADD_ROW:
      state.codes.splice(state.rows, 0, action.payload.data);
      return {
        ...state,
        rows: state.rows + 1
      };
    case ACTION_TYPES.INSERT_TABLE:
      return {
        ...state,
        codes: action.payload.data,
        rows: action.payload.index
      };
    case ACTION_TYPES.DELETE_ROW:
      state.codes.splice(action.payload.index, 1);
      return {
        ...state,
        rows: state.rows - 1
      };
    default:
      return state;
  }
};

export const addRow = (code: ICode) => async dispatch =>
  dispatch({
    type: ACTION_TYPES.ADD_ROW,
    payload: {
      data: code
    }
  });

export const insertTable = (codes: ICode[]) => ({
  type: ACTION_TYPES.INSERT_TABLE,
  payload: {
    data: codes,
    index: codes.length
  }
});

export const deleteRow = id => ({
  type: ACTION_TYPES.DELETE_ROW,
  payload: {
    index: id
  }
});
