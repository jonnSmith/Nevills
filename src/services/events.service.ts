import {Injectable, EventEmitter} from '@angular/core';
import {iEvent} from '../interfaces/event.interface';

/**
 * Startup service.
 */
@Injectable()
export class EventsService {

  public events:Array<iEvent> = [];
  public onEventsChange: EventEmitter<Array<iEvent>> = new EventEmitter();

  constructor(
  ) {
  }

  getDummy() {
    const dummy:iEvent =  {
      title: 'New ball',
      month: '1990-02-19',
      timeStarts: '07:43',
      timeEnds: '1990-02-20',
      repeat: true
    };
    return dummy;
  }

  push(event: iEvent) {
    this.events.push(event);
    this.onEventsChange.emit(this.events);
  }

  get() {
    return this.events;
  }

}
