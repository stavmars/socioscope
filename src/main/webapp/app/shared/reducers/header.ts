export const ACTION_TYPES = {
  SHOW_HEADER: 'header/SHOW_HEADER',
  HIDE_HEADER: 'header/HIDE_HEADER'
};

const initialState = {
  isHeaderVisible: false
};

export type HeaderState = Readonly<typeof initialState>;

// Reducer
export default (state: HeaderState = initialState, action): HeaderState => {
  switch (action.type) {
    case ACTION_TYPES.SHOW_HEADER:
      return {
        ...state,
        isHeaderVisible: true
      };
    case ACTION_TYPES.HIDE_HEADER:
      return {
        ...state,
        isHeaderVisible: false
      };
    default:
      return state;
  }
};

// Actions
export const showHeader = () => ({
  type: ACTION_TYPES.SHOW_HEADER
});

export const hideHeader = () => ({
  type: ACTION_TYPES.HIDE_HEADER
});
