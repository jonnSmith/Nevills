import {Injectable} from '@angular/core';
import {FCM} from '@ionic-native/fcm';
import {LocalNotifications} from '@ionic-native/local-notifications';

/**
 * Notifications service.
 */
@Injectable()
export class NotificationsService {
  constructor(private localNotifications: LocalNotifications,
              private fcm: FCM) {

  }
  initClick() {
    this.fcm.onNotification().subscribe(data => {
      console.log("FCM opened", data);
    });
    this.localNotifications.on('click').subscribe( data => {
      console.log("local notification click", data);
    });
  }

}
