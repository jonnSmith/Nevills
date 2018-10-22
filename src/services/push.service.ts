import {Injectable, EventEmitter} from '@angular/core';
import {Config} from '../config.service';

/**
 * Push service.
 */
@Injectable()
export class PushService {

  public pushObject;
  public onPush: EventEmitter<any> = new EventEmitter();

  constructor(
    private config: Config
  ) {}

    init() {
      if(window['cordova'] && window['PushNotification']) {
        this.pushObject = window['PushNotification'].init(this.config.pushOptions);
        this.notificate();
      }
    }

    register() {
      if(window['cordova'] && window['PushNotification']) {
        return new Promise((res) => {
          this.pushObject.on('registration', (data) => {
            res(data.registrationId);
          })
        });
      } else {
        new Promise ((res) => res('browser'));
      }
    }

    notificate() {
      this.pushObject.on('notification', data => {
        console.log('Received a notification', data);
        this.onPush.emit(data);
      });
    }

}
