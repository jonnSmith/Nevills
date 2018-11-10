import {Component, ViewChild, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {CalendarComponent} from 'ng-fullcalendar';
import {Options} from 'fullcalendar';
import {EventsService} from '../../services/events.service';
import {iEvent} from '../../interfaces/event.interface';
import {Config} from '../../config.service';
import {EventScreen} from '../event/event';

@Component({
  selector: 'calendar',
  templateUrl: 'calendar.html'
})
export class CalendarScreen implements OnInit {

  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  constructor(private config: Config,
              private nav: NavController,
              private translate: TranslateService,
              private eventService: EventsService
  ) {
  }

  ngOnInit() {
    this.calendarOptions = {...this.config.CALENDAR_CONFIG, ...{events: this.eventService.get()}};
    this.eventService.onEventsChange.subscribe((evts: Array<iEvent>) => {
      this.ucCalendar.fullCalendar( 'removeEvents' );
      this.ucCalendar.fullCalendar('renderEvents', evts, true);
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
     this.ucCalendar.fullCalendar('option', 'locale', event.lang);
    });
  }

  clickEvent(event: iEvent) {
    this.nav.push(EventScreen, { id: event.id });
  }

}
