import {Component} from '@angular/core';
import {Observable} from 'rxjs/rx';
import {StartupService} from '../services/startup.service';
import {TabsPage} from '../pages/tabs/tabs';
import {Store} from '@ngrx/store';
import {State} from '../state/event/event.reducer';
import {iEvent} from '../state/event/event.model';

@Component({
  templateUrl: 'app.html'
})

/**
 * Root component: set root page as tabs and run startup actions
 */
export class NevillsApp {
  rootPage: any = TabsPage;

  public events: Observable<iEvent[]>;

  constructor(
    private start: StartupService,
    private store: Store<State>
  ) {
    // Run startup service function on application load
    this.start.init();
    this.events = this.store.select(state => state.events);
  }

}
