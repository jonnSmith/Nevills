import {Component, ViewChild, OnInit} from '@angular/core';
import {CalendarComponent} from 'ng-fullcalendar';
import {EventsService} from '../../services/events.service';
import {iEvent} from '../../interfaces/event.interface';
import {Options} from 'fullcalendar';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage implements OnInit {

  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  constructor(
    private eventService: EventsService
  ) {
    this.eventService.onEventsChange.subscribe((evts: Array<iEvent>) => {
      this.calendarOptions.events = evts;
    });
  }

  ngOnInit() {
    this.calendarOptions = {
      editable: true,
      eventLimit: false,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listMonth',
      },
      events: this.eventService.get()
    };
    console.log('calendarOptions', this.calendarOptions);
  }

}
