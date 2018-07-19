import {Component, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CalendarComponent} from 'ng-fullcalendar';
import {Options} from 'fullcalendar';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  constructor(public navCtrl: NavController) {
  }

  ngOnInit() {
    this.calendarOptions = {
      editable: true,
      eventLimit: false,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listMonth'
      }
    };
  }

}
