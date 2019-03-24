import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError } from 'rxjs/operators';


import {iEvent} from './event.model';
import * as EventActions from './event.actions';
import {EventsService} from '../../services/events.service';
import {State} from './event.reducer';

@Injectable()
export class EventsEffects {

  @Effect() getAllEvents$: Observable<Action> = this.actions$.pipe(
    ofType(EventActions.GET_ALL_EVENTS)
    .withLatestFrom(
      this.store$.select(state => state.events)
    )
    .switchMap((events: iEvent[]) => {

      if (events) {
        return [new EventActions.GetAllEventsSuccess(events)];
      }

      return this.eventService.read().
      then(
        map((events: iEvent[]) => new EventActions.GetAllEventsSuccess(events)),
        catchError(err => of(new EventActions.GetAllEventsFail(err)))
      )

    }));
//
//   @Effect()
//   getEventById: Observable<Action> = this.actions$
//     .ofType(EventActions.GET_EVENT)
//     .pipe(
//       map((action: EventActions.GetEvent) => action.payload),
//       switchMap((id: string) => this.eventService.getEvent(id).
//       pipe(
//         map((todo: Event) => new EventActions.GetEventSuccess(todo)),
//         catchError(err => of(new EventActions.GetEventFail(err)))
//       ))
//     );

  constructor(
    private actions$: Actions,
    private eventService: EventsService,
    private store$: Store<State>
  ) { }
}
