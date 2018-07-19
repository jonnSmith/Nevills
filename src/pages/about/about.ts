import {Component} from '@angular/core';
import {EventsService} from '../../services/events.service';
import {iEvent} from '../../interfaces/event.interface';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  public events:Array<iEvent> = [];

  constructor(private eventService: EventsService) {
    this.events = this.eventService.get();
    this.eventService.onEventsChange.subscribe((evts) => {
      this.events = evts;
    });
  }

}
