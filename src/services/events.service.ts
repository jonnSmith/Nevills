import {Injectable, EventEmitter} from '@angular/core';
import {DatePipe} from '@angular/common';
import {File} from '@ionic-native/file';
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
              private http: HttpService,
              private datepipe: DatePipe,
              private file: File) {
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
   * @returns {Promise<any>} Get events from ionic storage or set empty array
   */
  init() {
    return new Promise((res) => {
      if(window['cordova']) {
        this.file.checkFile(this.file.dataDirectory, this.config.filename).then((flag) => {
          if(flag) {
            this.file.readAsText(this.file.dataDirectory, this.config.filename).then((data) => {
              // console.log('read', data);
              this.events = data ? JSON.parse(data) : [];
              res(this.events);
            }, (err) => {
              console.log('file read error', err);
              this.events = [];
              res(this.events);
            });
          } else {
            // console.log('empty file');
            this.events = [];
            res(this.events);
          }
        }, (err) => {
          console.log('file check error', err);
          this.events = [];
          res(this.events);
        });
      } else {
        let events = localStorage.getItem(this.config.EVENTS_STORAGE_KEY);
        console.log('events', events);
        this.events = events ? JSON.parse(events) : [];
        res(this.events);
      }
    });
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
      evt.token = localStorage.getItem(this.config.STORAGE_FCM_TOKEN_KEY);
      evt.id = evt.id + evt.token;
      this.http.post(this.config.backend.host + this.config.backend.api.layer, evt).then( _ => {
        this.events.push(evt);
        if(window['cordova']) {
          this.file.writeFile(this.file.dataDirectory, this.config.filename, JSON.stringify(this.events), {replace: true}).then(_ => {
            // console.log('write');
            this.currentDatestamp = evt.datestamp;
            this.onEventsChange.emit(this.events);
            res();
          });
        } else {
          localStorage.setItem(this.config.EVENTS_STORAGE_KEY, JSON.stringify(this.events));
          this.currentDatestamp = evt.datestamp;
          console.log();
          this.onEventsChange.emit(this.events);
          res();
        }
      }, (err) => {
        console.log('http error post', err);
        rej(err);
      });
    });
  }

  pop(event: iEvent) {
    return new Promise((res) => {
      this.http.post(this.config.backend.host + this.config.backend.api.layer + 'delete', event).then( _ => {
        this.events = this.events.filter(e => e.id !== event.id);
        if(window['cordova']) {
          this.file.writeFile(this.file.dataDirectory, this.config.filename, JSON.stringify(this.events), {replace: true}).then(_ => {
            this.onEventsChange.emit(this.events);
            res();
          });
        } else {
          localStorage.setItem(this.config.EVENTS_STORAGE_KEY, JSON.stringify(this.events));
          this.onEventsChange.emit(this.events);
          // console.log('local evts', localStorage.getItem(this.config.EVENTS_STORAGE_KEY));
          res();
        }
      }, (err) => {
        console.log('http error post', err);
        res();
      });
    });
  }

  put(event: iEvent) {
    return new Promise((res) => {
      const token = localStorage.getItem(this.config.STORAGE_FCM_TOKEN_KEY);
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
          if(window['cordova']) {
            this.file.writeFile(this.file.dataDirectory, this.config.filename, JSON.stringify(this.events), {replace: true}).then(_ => {
              this.onEventsChange.emit(this.events);
              res();
            });
          } else {
            localStorage.setItem(this.config.EVENTS_STORAGE_KEY, JSON.stringify(this.events));
            this.onEventsChange.emit(this.events);
            res();
          }
        }, (err) => {
          console.log('http error post', err);
          res();
        });
      }, (err) => {
        console.log('http error del', err);
        res();
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
      photo: null,
      sound: "ring"
    };
  }

}
