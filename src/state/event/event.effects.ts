import {Injectable} from '@angular/core';
import {Store, Action} from '@ngrx/store';
import {Effect, Actions} from '@ngrx/effects';
import {Observable} from 'rxjs/rx';

import {EventsService} from '../../services/events.service';
import {AppState} from "../app.state";
import {iEvent} from './event.model';
import {EventActions} from './event.actions';

@Injectable()
export class EventEffects {

  constructor(private actions$: Actions,
              private store$: Store<AppState>,
              private service: EventsService,
              private eventActions: EventActions) {
  }

  // @Effect() addEvent$ = this.actions$
  //   .ofType(EventActions.ADD_EVENT)
  //   .map<iEvent>(action => action.payload)
  //   .mergeMap(event => this.service.add(event));
  //
  // @Effect() updateEvent$ = this.actions$
  //   .ofType(EventActions.UPDATE_EVENT)
  //   .map<iEvent>(action => action.payload)
  //   .mergeMap(event => this.service.update(event));
  //
  // @Effect() deleteEvent$ = this.actions$
  //   .ofType(EventActions.DELETE_EVENT)
  //   .map<iEvent>(action => action.payload)
  //   .mergeMap(event => this.service.delete(event));


  @Effect() getEvents$ = this.actions$
    .withLatestFrom(this.store$)
    .map(([action, state]) => {
      // console.log('state', state);
      // console.log('action', action);
      // if (state.events) {
      //   return this.eventActions.loadEventsSuccess(state.events);
      // }
      return this.service.read();
    });
}
