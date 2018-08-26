import {Component, ViewChild, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CalendarComponent} from 'ng-fullcalendar';
import {Options} from 'fullcalendar';
import {EventsService} from '../../services/events.service';
import {iEvent} from '../../interfaces/event.interface';
import {Config} from '../../config.service';
import {EventScreen} from '../event/event'

@Component({
  selector: 'calendar',
  templateUrl: 'calendar.html'
})
export class CalendarScreen implements OnInit {

  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  events: Array<iEvent>;

  constructor(private config: Config,
              private nav: NavController,
              private eventService: EventsService
  ) {
  }

  ngOnInit() {
    this.events = [...this.eventService.get()];
    this.calendarOptions = {...this.config.CALENDAR_CONFIG, ...{events: this.events}}
    this.eventService.onEventsChange.subscribe((evts: Array<iEvent>) => {
      this.events = [...evts];
      this.calendarOptions = {...this.config.CALENDAR_CONFIG, ...{events: this.events}};
    });
  }

  clickEvent(event: iEvent) {
    this.nav.push(EventScreen, { id: event.id });
  }

}
