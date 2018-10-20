import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {EventScreen} from '../event/event';
import {FCM} from "@ionic-native/fcm";

import { AddScreen } from '../add/add';
import { ListScreen } from '../list/list';
import { CalendarScreen } from '../calendar/calendar';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = AddScreen;
  tab2Root = ListScreen;
  tab3Root = CalendarScreen;

  constructor(
    private fcm: FCM,
    private nav: NavController
  ) {
    if(window['cordova']) {
      this.fcm.onNotification().subscribe(data => {
        console.log("FCM opened", data);
        if (data.url) this.nav.push(EventScreen, {id: data.url});
      });
    }
  }
}
