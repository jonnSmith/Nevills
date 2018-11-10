import {Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {NavController} from 'ionic-angular';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {CalendarComponent} from 'ng-fullcalendar';
import {Options} from 'fullcalendar';
import {ISubscription} from 'rxjs/Subscription';
import {EventsService} from '../../services/events.service';
import {iEvent} from '../../interfaces/event.interface';
import {Config} from '../../config.service';
import {EventScreen} from '../event/event';

@Component({
  selector: 'calendar',
  templateUrl: 'calendar.html'
})
export class CalendarScreen implements OnInit, OnDestroy {

  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  // Array for subscriptions
  private _subscriptions: ISubscription[] = [];

  constructor(private config: Config,
              private nav: NavController,
              private translate: TranslateService,
              private eventService: EventsService
  ) {
  }

  /**
   * Setup and subscribe to data after component init
   */
  ngOnInit() {
    // Setup calendar from config and fill with events with deep copy and concat of two objects
    this.calendarOptions = {...this.config.CALENDAR_CONFIG, ...{events: this.eventService.get()}};

    // Subscribe for update events
    const eventsSub = this.eventService.onEventsChange.subscribe((evts: Array<iEvent>) => {
      this.ucCalendar.fullCalendar( 'removeEvents' );
      this.ucCalendar.fullCalendar('renderEvents', evts, true);
    });
    // Subscribe for change locale
    const localeSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
     this.ucCalendar.fullCalendar('option', 'locale', event.lang);
    });
    this._subscriptions.push(eventsSub, localeSub);

  }

  /**
   * Open event page on click by id
   * @param {iEvent} event
   */
  clickEvent(event: iEvent) {
    this.nav.push(EventScreen, { id: event.id });
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this._subscriptions.map(subscription => subscription.unsubscribe());
  }

}
