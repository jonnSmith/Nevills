import { ActionReducer } from '@ngrx/store';
import { EventActions, EventAction } from './event.actions';

import { iEvent } from './event.model';

export const EventsReducer: ActionReducer<iEvent[]> = (state: iEvent[] = [], action: EventAction) => {
  switch(action.type) {
    case EventActions.LOAD_EVENTS_SUCCESS:
      return action.payload;
    case EventActions.ADD_UPDATE_EVENT_SUCCESS:
      const exists = state.find(event => event.id === action.payload.id);
      if (exists) {
        // UPDATE
        return state.map(event => {
            return event.id === action.payload.id ? Object.assign({}, event, action.payload) : event;
        });
      }
      else {
        // ADD
        return [...state, Object.assign({}, action.payload)];
      }
    case EventActions.DELETE_EVENT_SUCCESS:
      return state.filter(event => event.id !== action.payload);
    default:
      return state;
  }
}
