import {Component, ViewChild, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AlertController, Tabs} from 'ionic-angular';
import {EventsService} from "../../services/events.service";
import {PushService} from "../../services/push.service";
import {AddScreen} from '../add/add';
import {ListScreen} from '../list/list';
import {CalendarScreen} from '../calendar/calendar';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit {

  @ViewChild('navTabs') tabRef: Tabs;

  tab1Root = AddScreen;
  tab2Root = ListScreen;
  tab3Root = CalendarScreen;

  prompt;

  constructor(
    private alertCtrl: AlertController,
    private eventService: EventsService,
    private translate: TranslateService,
    private push: PushService
  ) {
  }

  ngOnInit() {
    this.push.onPush.subscribe((data) => {
      if (data.additionalData && data.additionalData.url && !this.prompt) {
        const translateSubscription = this.translate.get(['close', 'more']).subscribe(t => {
          this.prompt = this.alertCtrl.create({
            title: data.title,
            message: data.message,
            buttons: [
              {
                text: t.close,
                handler: () => {
                  translateSubscription.unsubscribe();
                  this.prompt = null;
                }
              },
              {
                text: t.more,
                handler: () => {
                  this.tabRef.select(1).then( _ => {
                    this.eventService.onEventsPushed.emit(data.additionalData.url);
                    this.prompt = null;
                  });
                  translateSubscription.unsubscribe();
                }
              }
            ]
          });
          this.prompt.present();
        });
      }
    });
  }

}
