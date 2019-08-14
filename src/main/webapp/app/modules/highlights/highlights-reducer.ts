import axios from 'axios';
import { REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { IDataSet } from 'app/shared/model/data-set.model';
import { IDimensionCode } from 'app/shared/model/dimension-code.model';
import { IDimension } from 'app/shared/model/dimension.model';
import _ from 'lodash';
import { unflattenDimensionCodes } from 'app/shared/util/entity-utils';
import { IHighlight } from 'app/shared/model/highlight.model';

export const ACTION_TYPES = {
  LOAD_HIGHLIGHT: 'highlights/LOAD_HIGHLIGHT',
  FETCH_HIGHLIGHT_SERIES: 'highlights/FETCH_HIGHLIGHT_SERIES',
  FETCH_DIMENSION_CODELIST: 'highlights/FETCH_DIMENSION_CODELIST',
  FETCH_DIMENSION_CODELISTS: 'highlights/FETCH_DIMENSION_CODELISTS'
};

const initialState = {
  highlightSeries: {} as any,
  dimensionCodes: {} as any
};

export type HighlightsState = Readonly<typeof initialState>;

// Reducer
export default (state: HighlightsState = initialState, action): HighlightsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.LOAD_HIGHLIGHT):
      return {
        ...state,
        highlightSeries: {
          ...state.highlightSeries,
          [action.meta.id]: { loading: true }
        }
      };
    case SUCCESS(ACTION_TYPES.LOAD_HIGHLIGHT):
      return {
        ...state,
        highlightSeries: {
          ...state.highlightSeries,
          [action.meta.id]: { series: action.payload.series, loading: false }
        }
      };
    case SUCCESS(ACTION_TYPES.FETCH_DIMENSION_CODELIST):
      return {
        ...state,
        dimensionCodes: {
          ...state.dimensionCodes,
          [action.payload.dimensionId]: {
            codes: unflattenDimensionCodes(action.payload.codelist),
            codesByNotation: _.keyBy(action.payload.codelist, 'notation')
          }
        }
      };
    default:
      return {
        ...state
      };
  }
};

const datasetApiUrl = 'api/data-sets';
const dimensionApiUrl = 'api/dimensions';

export const getDimensionCodeList = (dimension: IDimension) => (dispatch, getState) => {
  const { dimensionCodes } = getState().highlights;
  if (!dimensionCodes[dimension.id]) {
    return dispatch({
      type: ACTION_TYPES.FETCH_DIMENSION_CODELIST,
      payload: axios
        .get<IDimensionCode>(`${dimensionApiUrl}/${dimension.id}/codelist`)
        .then(res => ({ dimensionId: dimension.id, codelist: res.data }))
    });
  }
};

export const loadHighlight = (dataset: IDataSet, highlight: IHighlight) => (dispatch, getState) => {
  const requestUrl = `${datasetApiUrl}/${dataset.id}/series`;
  const { highlightSeries } = getState().highlights;
  if (highlightSeries[highlight.id]) {
    return;
  }
  const promise = Promise.all([
    ...dataset.dimensions.map(dimension => {
      if (
        dimension.id === highlight.seriesOptions.xAxis ||
        (highlight.seriesOptions.compareBy && dimension.id === highlight.seriesOptions.compareBy)
      ) {
        return dispatch(getDimensionCodeList(dimension));
      }
    }),
    axios.post(requestUrl, highlight.seriesOptions)
  ]).then(responses => ({ series: responses[responses.length - 1].data }));
  dispatch({
    type: ACTION_TYPES.LOAD_HIGHLIGHT,
    payload: promise,
    meta: { id: highlight.id }
  });
};
