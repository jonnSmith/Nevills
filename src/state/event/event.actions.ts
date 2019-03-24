import { Action } from "@ngrx/store";
import { iEvent } from "./event.model";

export const GET_ALL_EVENTS = '[EVENT] Get All Events';
export const GET_ALL_EVENTS_SUCCESS = '[EVENT] Get All Events Success';
export const GET_ALL_EVENTS_FAIL = '[EVENT] Get All Events Fail';

export const GET_EVENT = '[EVENT] Get Event';
export const GET_EVENT_SUCCESS = '[EVENT] Get Event Success';
export const GET_EVENT_FAIL = '[EVENT] Get Event Fail';

export const ADD_EVENT = '[EVENT] Add Event';
export const ADD_EVENT_SUCCESS = '[EVENT] Add Event Success';
export const ADD_EVENT_FAIL = '[EVENT] Add Event Fail';

export const DELETE_EVENT = '[EVENT] Delete Event';
export const DELETE_EVENT_SUCCESS = '[EVENT] Delete Event Success';
export const DELETE_EVENT_FAIL = '[EVENT] Delete Event Fail';

export const UPDATE_EVENT = '[EVENT] Update Event';
export const UPDATE_EVENT_SUCCESS = '[EVENT] Update Event Success';
export const UPDATE_EVENT_FAIL = '[EVENT] Update Event Fail';

//Get Event List
export class GetAllEvents implements Action {
  readonly type = GET_ALL_EVENTS;
}

export class GetAllEventsSuccess implements Action {
  readonly type = GET_ALL_EVENTS_SUCCESS;
  constructor(public payload: iEvent[]) { }
}

export class GetAllEventsFail implements Action {
  readonly type = GET_ALL_EVENTS_FAIL;
  constructor(public payload: any) { }
}

//Get event by id
export class GetEvent implements Action {
  readonly type = GET_EVENT;
  constructor(public payload: string) { }
}

export class GetEventSuccess implements Action {
  readonly type = GET_EVENT_SUCCESS;
  constructor(public payload: iEvent) { }
}

export class GetEventFail implements Action {
  readonly type = GET_EVENT_FAIL;
  constructor(public payload: any) { }
}

//Add event
export class AddEvent implements Action {
  readonly type = ADD_EVENT;
  constructor(public payload: iEvent) { }
}

export class AddEventSuccess implements Action {
  readonly type = ADD_EVENT_SUCCESS;
  constructor(public payload: iEvent[]) { }
}

export class AddEventFail implements Action {
  readonly type = ADD_EVENT_FAIL;
  constructor(public payload: any) { }
}

//Delete event
export class DeleteEvent implements Action {
  readonly type = DELETE_EVENT;
  constructor(public payload: iEvent) { }
}

export class DeleteEventSuccess implements Action {
  readonly type = DELETE_EVENT_SUCCESS;
  constructor(public payload: iEvent[]) { }
}

export class DeleteEventFail implements Action {
  readonly type = DELETE_EVENT_FAIL;
  constructor(public payload: any) { }
}

//Update event
export class UpdateEvent implements Action {
  readonly type = UPDATE_EVENT;
  constructor(public payload: iEvent) { }
}

export class UpdateEventSuccess implements Action {
  readonly type = UPDATE_EVENT_SUCCESS;
  constructor(public payload: iEvent[]) { }
}

export class UpdateEventFail implements Action {
  readonly type = UPDATE_EVENT_FAIL;
  constructor(public payload: any) { }
}

export type EventActions =
  GetAllEvents
  | GetAllEventsSuccess
  | GetAllEventsFail
  | GetEvent
  | GetEventSuccess
  | GetEventFail
  | AddEvent
  | AddEventSuccess
  | AddEventFail
  | DeleteEvent
  | DeleteEventSuccess
  | DeleteEventFail
  | UpdateEvent
  | UpdateEventSuccess
  | UpdateEventFail;
