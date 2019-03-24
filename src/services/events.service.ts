import {Injectable, EventEmitter} from '@angular/core';
import {File} from '@ionic-native/file';
import {iEvent} from '../state/event/event.model';
import {HttpService} from './http.service'
import {Config} from '../config.service';
import { Observable } from 'rxjs/rx';

/**
 * Events service for managing events data between backend and client
 */
@Injectable()
export class EventsService {

  // Events array storage
  public events: Array<iEvent> = [];
  // Emitter for changes in events array notifying
  public onEventsChange: EventEmitter<Array<iEvent>> = new EventEmitter();
  // Emitter for pass push event from tabs to list component
  public onEventsPushed: EventEmitter<String> = new EventEmitter();

  public isMobile: boolean;

  constructor(private config: Config,
              private http: HttpService,
              private file: File) {
    this.isMobile = window['cordova'];
  }

  /**
   * Generate random id based on timestamp, random 4* digit and string shuffle
   * @returns {string} Unique randomized id
   */
  static generateRandomId() {
    return ((new Date).getTime() + Math.floor(1000 + Math.random() * 9000))
        .toString()
        .split('')
        .sort(function () {
          return 0.5 - Math.random()
        })
        .join('');
  }

  save(events) {
    if(this.isMobile) {
      return Observable.fromPromise(
        this.file.writeFile(this.file.dataDirectory, this.config.filename, JSON.stringify(events), {replace: true}).then(_ => {
          return events;
        })
      );
    } else {
      return Observable.of(localStorage.setItem(this.config.EVENTS_STORAGE_KEY, JSON.stringify(events)));
    }
  }

  read() {
    if(this.isMobile) {
      return Observable.fromPromise(this.file.checkFile(this.file.dataDirectory, this.config.filename).then(flag => {
        if (flag) {
          return this.file.readAsText(this.file.dataDirectory, this.config.filename)
        } else {
          return null;
        }
      }).then((data) => {
        return data ? JSON.parse(data) : [];
      }));
    } else {
      return Observable.of(this.config.EVENTS_STORAGE_KEY in localStorage);
    }
  }

  post(evt: iEvent) {
    return this.http.post(this.config.backend.host + this.config.backend.api.layer, evt);
  }

  del(evt: iEvent) {
    return this.http.post(this.config.backend.host + this.config.backend.api.layer + 'delete', evt);
  }


  /**
   * Init function with read local stored events from file on device or local storage on debug web mode
   * @returns {Promise<any>} Get events from ionic storage or set empty array
   */
  init() {
    return new Promise((res) => {
      if(window['cordova']) {
        this.file.checkFile(this.file.dataDirectory, this.config.filename).then((flag) => {
          if(flag) {
            // Read file after EOF reached in promise and set file data to events store
            this.file.readAsText(this.file.dataDirectory, this.config.filename).then((data) => {
              this.events = data ? JSON.parse(data) : [];
              // Notify on events changed
              this.onEventsChange.emit(this.events);
              res();
            }, (err) => {
              console.log('file read error', err);
              this.events = [];
              // Notify on events changed
              this.onEventsChange.emit(this.events);
              res(this.events);
            });
          } else {
            this.events = [];
            // Notify on events changed
            this.onEventsChange.emit(this.events);
            res(this.events);
          }
        }, (err) => {
          console.log('file check error', err);
          this.events = [];
          // Notify on events changed
          this.onEventsChange.emit(this.events);
          res(this.events);
        });
      } else {
        // Get saved events from local storage in web debug mode
        let events = localStorage.getItem(this.config.EVENTS_STORAGE_KEY);
        this.events = events ? JSON.parse(events) : [];
        // Notify on events changed
        this.onEventsChange.emit(this.events);
        res(this.events);
      }
    });
  }



  /**
   * Save new event on backed and in storage - file or local storage in debug
   * @param {iEvent} event
   * @returns {Promise<any>}
   */
  push(event: iEvent) {
    return new Promise((res, rej) => {
      // Extend event object data with generated id and datestamp from start and time params
      const evt = {
        ...Object.assign({}, event),
        ...{
          id: EventsService.generateRandomId(),
          datestamp: new Date(event.start + ' ' + event.time).getTime().toString()
        }
      };
      evt.list = evt.list.filter((e) => e && e.description);
      evt.token = localStorage.getItem(this.config.STORAGE_FCM_TOKEN_KEY);
      evt.id = evt.id + evt.token;
      // Send event complete object to backend and update stored value on promise fulfilled
      this.http.post(this.config.backend.host + this.config.backend.api.layer, evt).then( _ => {
        this.events.push(evt);
        if(window['cordova']) {
          this.file.writeFile(this.file.dataDirectory, this.config.filename, JSON.stringify(this.events), {replace: true}).then(_ => {
            // Notify on events changed
            this.onEventsChange.emit(this.events);
            res();
          });
        } else {
          localStorage.setItem(this.config.EVENTS_STORAGE_KEY, JSON.stringify(this.events));
          // Notify on events changed
          this.onEventsChange.emit(this.events);
          res();
        }
      }, (err) => {
        console.log('http error post', err);
        rej(err);
      });
    });
  }

  /**
   * Delete event from backend and storage by datestamp and id
   * @param {iEvent} event
   * @returns {Promise<any>}
   */
  pop(event: iEvent) {
    return new Promise((res) => {
      // Delete event from backend and from stored value on promise fulfilled
      this.http.post(this.config.backend.host + this.config.backend.api.layer + 'delete', event).then( _ => {
        this.events = this.events.filter(e => e.id !== event.id);
        if(window['cordova']) {
          this.file.writeFile(this.file.dataDirectory, this.config.filename, JSON.stringify(this.events), {replace: true}).then(_ => {
            // Notify on events changed
            this.onEventsChange.emit(this.events);
            res();
          });
        } else {
          localStorage.setItem(this.config.EVENTS_STORAGE_KEY, JSON.stringify(this.events));
          // Notify on events changed
          this.onEventsChange.emit(this.events);
          res();
        }
      }, (err) => {
        console.log('http error post', err);
        res();
      });
    });
  }

  /**
   * Update event - delete old record and push new to backend and storage
   * @param {iEvent} newevent Updated event object
   * @param {iEvent} oldevent Old event object for delete from backend by datestamp and id
   * @returns {Promise<any>} Fulfilled then events successfully cleaned up and saved on backend and in storage
   */
  put(newevent: iEvent, oldevent: iEvent) {
    // Promise chain - delete from backend, update object data, push to backend and update stored value
    return new Promise((res) => {
      this.http.post(this.config.backend.host + this.config.backend.api.layer + 'delete', oldevent).then( _ => {
        // Extend edited event with new params for backend saving
        const evt = {
          ...Object.assign({}, newevent),
          ...{
            id: EventsService.generateRandomId(),
            datestamp: new Date(newevent.start + ' ' + newevent.time).getTime().toString()
          }
        };
        evt.list = evt.list.filter((e) => e && e.description);
        evt.token = localStorage.getItem(this.config.STORAGE_FCM_TOKEN_KEY);
        evt.id = evt.id + evt.token;
        this.http.post(this.config.backend.host + this.config.backend.api.layer, evt).then(_ => {
          this.events = this.events.map((e) => {
            if (e.id === oldevent.id) {
              Object.assign(e, evt);
            }
            return e;
          });
          if(window['cordova']) {
            this.file.writeFile(this.file.dataDirectory, this.config.filename, JSON.stringify(this.events), {replace: true}).then(_ => {
              // Notify on events changed
              this.onEventsChange.emit(this.events);
              res();
            });
          } else {
            localStorage.setItem(this.config.EVENTS_STORAGE_KEY, JSON.stringify(this.events));
            // Notify on events changed
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

  /**
   * Saved in service variable events array getter
   * @returns {Array<iEvent>} Service stored events array
   */
  get() {
    return this.events;
  }

  /**
   * Getter for event object by unique id
   * @param {String} id Event id
   * @returns {iEvent} Event object from service stored array
   */
  getEvent(id: String) {
    return this.events.find((e) => e.id === id);
  }

}
