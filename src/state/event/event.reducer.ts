import * as fromEvent from './event.actions';
import {iEvent} from './event.model';

export interface State {
  events: iEvent[],
  loading: boolean;
  error: string;
}

export const initialState: State = {
  events: [],
  loading: false,
  error: ''
};

export function EventReducer(state = initialState, action: fromEvent.EventActions): State {
  switch (action.type) {

    case fromEvent.GET_ALL_EVENTS: {
      return {
        ...state,
        loading: true
      };
    }

    case fromEvent.GET_ALL_EVENTS_SUCCESS: {
      return {
        ...state,
        loading: false,
        events: action.payload
      };
    }

    case fromEvent.GET_ALL_EVENTS_FAIL: {
      return {
        ...state,
        loading: false,
        error: 'error loading events'
      };
    }

    case fromEvent.GET_EVENT: {
      return {
        ...state,
        loading: true
      };
    }

    case fromEvent.GET_EVENT_SUCCESS: {
      return {
        ...state,
        loading: false
      };
    }

    case fromEvent.GET_EVENT_FAIL: {
      return {
        ...state,
        loading: false,
        error: 'error loading todo'
      };
    }

    default: {
      return state;
    }
  }
}

export const getAllEvents = (state: State) => state.events;
export const getLoading = (state: State) => state.loading;
export const getError = (state: State) => state.error;
