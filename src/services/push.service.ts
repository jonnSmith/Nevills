import {Injectable, EventEmitter} from '@angular/core';
import {Autostart} from '@ionic-native/autostart';
import {Config} from '../config.service';

/**
 * Push service.
 */
@Injectable()
export class PushService {

  public pushObject;
  public onPush: EventEmitter<any> = new EventEmitter();
  public buffer: string;

  constructor(
    private config: Config,
    private autostart: Autostart
  ) {}

    init() {
      if(window['cordova'] && window['PushNotification']) {
        this.autostart.enable();
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
        return new Promise ((res) => res('browser'));
      }
    }

    notificate() {
      this.pushObject.on('notification', data => {
        console.log('Received a notification', data);
        this.onPush.emit(data);
      });
    }

}
