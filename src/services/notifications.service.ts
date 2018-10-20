import {Injectable} from '@angular/core';
import {FCM} from '@ionic-native/fcm';
import {LocalNotifications, ILocalNotification} from '@ionic-native/local-notifications';
import {EventsService} from './events.service';
import {DatePipe} from '@angular/common'
import {Config} from '../config.service';
import {iEvent} from '../interfaces/event.interface';

/**
 * Notifications service.
 */
@Injectable()
export class NotificationsService {
  constructor(private config: Config,
              private eventService: EventsService,
              private localNotifications: LocalNotifications,
              private fcm: FCM,
              private datepipe: DatePipe) {

  }
  initInterval() {
    const that = this;
    setInterval(function(){
      let events =  that.eventService.get();
      if(events && events.length) {
        let datetime = new Date();
        let date = that.datepipe.transform(datetime, 'yyyy-MM-dd');
        // let time = that.datepipe.transform(datetime, 'HH:mm');
        let notifications : Array<ILocalNotification> = events.filter((e: iEvent) => {
          // Time check
          // e.time.replace(/:/g, '') === time.replace(/:/g, ''))
          return parseInt(date.replace(/-/g, '')) >= parseInt(e.start.replace(/-/g, ''))
            && parseInt(date.replace(/-/g, '')) <= parseInt(e.end.replace(/-/g, ''));
        }).map((e: iEvent) => {
          return {
            text: e.title,
            icon: e.photo !== that.config.DUMMY_PHOTO_HASH ? e.photo : null,
            data: {id: e.id}
          } as ILocalNotification;
        });
        console.log('notifications', notifications);
        if(notifications && notifications.length) that.localNotifications.schedule(notifications);
      }
    }, this.config.NOTIFICATIONS_INTERVAL);
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
