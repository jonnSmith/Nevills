import {Component, ViewChild, OnInit} from '@angular/core';
import {CalendarComponent} from 'ng-fullcalendar';
import {EventsService} from '../../services/events.service';
import {iEvent} from '../../interfaces/event.interface';
import {Options} from 'fullcalendar';

const CALENDAR_CONFIG = {
  editable: true,
  eventLimit: false,
  header: {
    left: 'prev,next today',
    center: 'title',
    right: 'month,agendaWeek,agendaDay,listMonth',
  }
};

@Component({
  selector: 'calendar',
  templateUrl: 'calendar.html'
})
export class CalendarScreen implements OnInit {

  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  events: Array<iEvent>;

  constructor(
    private eventService: EventsService
  ) {
  }

  ngOnInit() {
    this.events = [...this.eventService.get()];
    this.calendarOptions = {...CALENDAR_CONFIG, ...{events: this.events}}
    this.eventService.onEventsChange.subscribe((evts: Array<iEvent>) => {
      this.events = [...evts];
      this.calendarOptions = {...CALENDAR_CONFIG, ...{events: this.events}};
    });
  }

}
