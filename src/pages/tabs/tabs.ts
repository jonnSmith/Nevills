import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {EventScreen} from '../event/event';
import {PushService} from "../../services/push.service";
import {AddScreen} from '../add/add';
import {ListScreen} from '../list/list';
import {CalendarScreen} from '../calendar/calendar';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = AddScreen;
  tab2Root = ListScreen;
  tab3Root = CalendarScreen;

  prompt;

  constructor(
    private alertCtrl: AlertController,
    private nav: NavController,
    private push: PushService
  ) {
    this.push.onPush.subscribe((data) => {
      if(this.prompt) this.prompt.dismiss();
      if (data.additionalData && data.additionalData.url) {
        this.prompt = this.alertCtrl.create({
          title: data.title,
          message: data.message,
          buttons: [
            {
              text: 'Close',
              handler: () => {
              }
            },
            {
              text: 'Read more',
              handler: () => {
                this.nav.push(EventScreen, {id: data.additionalData.url});
              }
            }
          ]
        });
        this.prompt.present();
      }
    });
  }
}
