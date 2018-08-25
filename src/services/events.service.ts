import {Injectable, EventEmitter} from '@angular/core';
import {Storage } from '@ionic/storage';
import {iEvent} from '../interfaces/event.interface';

const EVENTS_STORAGE_KEY = 'nvls_evts';

/**
 * Startup service.
 */
@Injectable()
export class EventsService {

  public events: Array<iEvent> = [];
  public onEventsChange: EventEmitter<Array<iEvent>> = new EventEmitter();

  constructor(
    private storage: Storage
  ) {
  }

  /**
   *
   * @returns {Promise<any>} Get events from ionic stotage or set empty array
   */
  init() {
    return new Promise((res) => {
        this.storage.get(EVENTS_STORAGE_KEY).then((val: Array<iEvent>) => {
          if (val && val.length)  { this.events = val; }
          else { this.events = []; }
          res(this.events.length);
        });
      }
    )
  }

  getDummy() {
    return {
      id: 0,
      title: 'New ball',
      start: '1990-02-19',
      end: '1990-02-20',
      time: '21:30',
      allDay: true,
      repeat: true
    };
  }

  push(event: iEvent) {
    event.id = Date.now();
    this.events.push(event);
    this.storage.set(EVENTS_STORAGE_KEY, this.events);
    this.onEventsChange.emit(this.events);
  }

  pop(id: Number) {
    this.events = this.events.filter(e => e.id !== id);
    this.storage.set(EVENTS_STORAGE_KEY, this.events);
    this.onEventsChange.emit(this.events);
  }

  get() {
    return this.events;
  }

}
