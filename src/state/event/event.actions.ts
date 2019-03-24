import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

export class EventAction implements Action {
  type: string;
  payload: any;
}

import { iEvent } from './event.model';

@Injectable()
export class EventActions {

  static ADD_EVENT = 'ADD_EVENT';
  addEvent(event: iEvent): EventAction {
    return {
      type: EventActions.ADD_EVENT,
      payload: event
    }
  }

  static UPDATE_EVENT = 'UPDATE_EVENT';
  updateEvent(events: iEvent[]): EventAction {
    return {
      type: EventActions.UPDATE_EVENT,
      payload: events
    }
  }

  static DELETE_EVENT = 'DELETE_EVENT';
  deleteEvent(event: iEvent): EventAction {
    return {
      type: EventActions.DELETE_EVENT,
      payload: event
    }
  }

  static LOAD_EVENTS_SUCCESS = 'LOAD_EVENTS_SUCCESS';
  loadEventsSuccess(events: iEvent[]): EventAction {
    return {
      type: EventActions.LOAD_EVENTS_SUCCESS,
      payload: events
    }
  }

  static ADD_UPDATE_EVENT_SUCCESS = 'ADD_UPDATE_EVENT_SUCCESS';
  addUpdateEventSuccess(events: iEvent[]): EventAction {
    return {
      type: EventActions.ADD_UPDATE_EVENT_SUCCESS,
      payload: events
    }
  }

  static DELETE_EVENT_SUCCESS = 'DELETE_EVENT_SUCCESS';
  deleteEventSuccess(events: iEvent[]): EventAction {
    return {
      type: EventActions.DELETE_EVENT_SUCCESS,
      payload: events
    }
  }

}
