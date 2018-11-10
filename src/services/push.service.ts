import {Injectable, EventEmitter} from '@angular/core';
import {Autostart} from '@ionic-native/autostart';
import {Config} from '../config.service';

/**
 * Push FCM service.
 */
@Injectable()
export class PushService {

  // Store object for push plugin with configured data initialization
  public pushObject;
  // Emitter for incoming push object
  public onPush: EventEmitter<any> = new EventEmitter();


  constructor(private config: Config,
              private autostart: Autostart) {
  }

  /**
   * Init function - eneable autostart for baground push receive and configure push plugin
   */
  init() {
    if (window['cordova'] && window['PushNotification']) {
      this.autostart.enable();
      this.pushObject = window['PushNotification'].init(this.config.pushOptions);
      this.notificate();
    }
  }

  /**
   * Registration on FCM with setted up configuration to get FCM token
   * @returns {Promise<any>} Fulfilled on FCM token received on device, set dummy token for web debug
   */
  register() {
    if (window['cordova'] && window['PushNotification']) {
      return new Promise((res) => {
        this.pushObject.on('registration', (data) => {
          res(data.registrationId);
        });
      });
    } else {
      return new Promise((res) => res('browser'));
    }
  }

  /**
   * Notify with emitter on push received from device
   */
  notificate() {
    this.pushObject.on('notification', data => {
      console.log('Received a notification', data);
      this.onPush.emit(data);
    });
  }

}
