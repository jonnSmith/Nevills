import {Component} from '@angular/core';
import {EventsService} from '../../services/events.service';
import {iEvent} from '../../interfaces/event.interface';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public event: iEvent;
  public allEvents:Array<iEvent> = [];

  constructor(
    private events: EventsService
  ) {
    this.event = this.events.getDummy();
    this.events.onEventsChange.subscribe((evts) => {
      this.allEvents = evts;
      this.event = this.events.getDummy();
    });
  }

  addEvent() {
    this.events.push(this.event);
  }


}
