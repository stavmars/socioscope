export const ACTION_TYPES = {
  SHOW_HEADER: 'header/SHOW_HEADER',
  HIDE_HEADER: 'header/HIDE_HEADER',
  SHOW_TOPICS_MENU: 'header/SHOW_TOPICS_MENU',
  HIDE_TOPICS_MENU: 'header/HIDE_TOPICS_MENU',
  TOGGLE_TOPICS_MENU: 'header/TOGGLE_TOPICS_MENU'
};

const initialState = {
  isHeaderVisible: false,
  isTopicsMenuVisible: false
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
    case ACTION_TYPES.SHOW_TOPICS_MENU:
      return {
        ...state,
        isTopicsMenuVisible: true
      };
    case ACTION_TYPES.HIDE_TOPICS_MENU:
      return {
        ...state,
        isTopicsMenuVisible: false
      };
    case ACTION_TYPES.TOGGLE_TOPICS_MENU:
      return {
        ...state,
        isTopicsMenuVisible: !state.isTopicsMenuVisible
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

export const showTopicsMenu = () => ({
  type: ACTION_TYPES.SHOW_TOPICS_MENU
});

export const hideTopicsMenu = () => ({
  type: ACTION_TYPES.HIDE_TOPICS_MENU
});

export const toggleTopicsMenu = () => ({
  type: ACTION_TYPES.TOGGLE_TOPICS_MENU
});
