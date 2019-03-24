import {Component} from '@angular/core';
import {StartupService} from '../services/startup.service';
import {TabsPage} from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})

/**
 * Root component: set root page as tabs and run startup actions
 */
export class NevillsApp {
  rootPage: any = TabsPage;

  constructor(
    private start: StartupService
  ) {
    // Run startup service function on application load
    this.start.init();
  }

}
