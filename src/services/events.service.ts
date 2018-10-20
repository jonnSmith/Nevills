import {Injectable, EventEmitter} from '@angular/core';
import {DatePipe} from '@angular/common'
import {Storage} from '@ionic/storage';
import {iEvent} from '../interfaces/event.interface';
import {HttpService} from './http.service'
import {Config} from '../config.service';

/**
 * Events service.
 */
@Injectable()
export class EventsService {

  public events: Array<iEvent> = [];
  public onEventsChange: EventEmitter<Array<iEvent>> = new EventEmitter();
  public currentDatestamp: string;

  constructor(private config: Config,
              private storage: Storage,
              private http: HttpService,
              private datepipe: DatePipe) {
  }

  // Generate random id based on timestamp, random 4* digit and string shuffle
  static generateRandomId() {
    return ((new Date).getTime() + Math.floor(1000 + Math.random() * 9000))
        .toString()
        .split('')
        .sort(function () {
          return 0.5 - Math.random()
        })
        .join('');
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
    return new Promise((res, rej) => {
      const evt = {
        ...Object.assign({}, event),
        ...{
          id: EventsService.generateRandomId(),
          datestamp: new Date(event.start + ' ' + event.time).getTime().toString()
        }
      };
      evt.list = evt.list.filter((e) => e && e !== this.config.DUMMY_LIST_ITEM);
      this.storage.get(this.config.STORAGE_FCM_TOKEN_KEY).then((token: string) => {
        evt.token = token;
        evt.id = evt.id + evt.token;
        this.http.post(this.config.backend.host + this.config.backend.api.layer, evt).then( _ => {
          this.events.push(evt);
          this.storage.set(this.config.EVENTS_STORAGE_KEY, this.events).then( () => {
            this.currentDatestamp = evt.datestamp;
            this.onEventsChange.emit(this.events);
            res();
          });
        }, (err) => {
          console.log('http error post', err);
          rej(err);
        });
      });
    });
  }

  pop(event: iEvent) {
    return new Promise((res) => {
      this.http.post(this.config.backend.host + this.config.backend.api.layer + 'delete', event).then( _ => {
        this.events = this.events.filter(e => e.id !== event.id);
        this.storage.set(this.config.EVENTS_STORAGE_KEY, this.events).then( () => {
          this.onEventsChange.emit(this.events);
          res();
        });
      }, (err) => {
        console.log('http error post', err);
        res();
      });
    });
  }

  put(event: iEvent) {
    return new Promise((res) => {
      this.storage.get(this.config.STORAGE_FCM_TOKEN_KEY).then((token: string) => {
        this.http.post(this.config.backend.host + this.config.backend.api.layer + 'delete', event).then( _ => {
          this.http.post(this.config.backend.host + this.config.backend.api.layer, event).then(_ => {
            this.events = this.events.map((e) => {
              if (e.id === event.id) {
                event.token = token;
                event.list = event.list.filter((e) => e && e !== this.config.DUMMY_LIST_ITEM);
                Object.assign(e, event);
              }
              return e;
            });
            this.storage.set(this.config.EVENTS_STORAGE_KEY, this.events).then( () => {
              this.onEventsChange.emit(this.events);
              res();
            });
          }, (err) => {
            console.log('http error post', err);
            res();
          });
        }, (err) => {
          console.log('http error del', err);
          res();
        });
      });
    });
  }

  get() {
    return this.events;
  }

  getEvent(id: String) {
    return this.events.find((e) => e.id === id);
  }

  getDummy() {
    const date = new Date();
    return {
      id: null,
      title: 'New ball',
      description: 'Add event description...',
      start: this.datepipe.transform(date, 'yyyy-MM-dd'),
      time: this.datepipe.transform(date, 'HH:mm'),
      datestamp: null,
      list: ['Add item to list'],
      token: 'browser',
      photo: null
    };
  }

}
