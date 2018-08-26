import {Injectable, EventEmitter} from '@angular/core';
import {DatePipe} from '@angular/common'
import {Storage} from '@ionic/storage';
import {iEvent} from '../interfaces/event.interface';
import {Config} from '../config.service';

/**
 * Startup service.
 */
@Injectable()
export class EventsService {

  public events: Array<iEvent> = [];
  public onEventsChange: EventEmitter<Array<iEvent>> = new EventEmitter();

  constructor(private config: Config,
              private storage: Storage,
              private datepipe: DatePipe
  ) {
  }

  // Generate random id based on timestamp, random 4* digit and string shuffle
  static generateRandomId() {
    return parseInt(
      ((new Date).getTime() + Math.floor(1000 + Math.random() * 9000))
      .toString()
      .split('')
      .sort(function(){return 0.5-Math.random()})
      .join(''));
  }

  /**
   *
   * @returns {Promise<any>} Get events from ionic stotage or set empty array
   */
  init() {
    return new Promise((res) => {
        this.storage.get(this.config.EVENTS_STORAGE_KEY).then((val: Array<iEvent>) => {
          this.events = val && val.length ? val : [];
          res(this.events);
        });
      }
    )
  }

  push(event: iEvent) {
    // Add random
    const evt = {
      ...Object.assign({}, event),
      ...{ id: EventsService.generateRandomId()}
    };
    evt.list = evt.list.filter((e) => e && e !== this.config.DUMMY_LIST_ITEM);
    this.events.push(evt);
    console.log('this.events', this.events);
    this.storage.set(this.config.EVENTS_STORAGE_KEY, this.events);
    this.onEventsChange.emit(this.events);
  }

  pop(id: Number) {
    console.log('this.events', this.events);
    this.events = this.events.filter(e => e.id !== id);
    console.log('this.events', this.events);
    this.storage.set(this.config.EVENTS_STORAGE_KEY, this.events);
    this.onEventsChange.emit(this.events);
  }

  put(event: iEvent) {
    this.events = this.events.map((e) => {
      if(e.id === event.id) {
        Object.assign(e, event);
      }
      return e;
    });
    if(!this.events) this.events = [];
    this.storage.set(this.config.EVENTS_STORAGE_KEY, this.events);
    this.onEventsChange.emit(this.events);
  }

  get() {
    return this.events;
  }

  getEvent(id: Number) {
    return this.events.find((e) => e.id === id);
  }

  getDummy() {
    const date = new Date();
    return {
      id: 0,
      title: 'New ball',
      description: 'Add event description...',
      start: this.datepipe.transform(date, 'yyyy-MM-dd'),
      end: this.datepipe.transform(date.setDate(date.getDate()+1), 'yyyy-MM-dd'),
      time: this.datepipe.transform(date, 'HH:mm'),
      allDay: false,
      repeat: true,
      list: ['Add item to list'],
      photo: this.config.DUMMY_PHOTO_HASH
    };
  }

}
