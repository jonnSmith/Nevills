import {Component, ViewChild, OnInit, ChangeDetectorRef} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AlertController, Tabs} from 'ionic-angular';
import {EventsService} from "../../services/events.service";
import {PushService} from "../../services/push.service";
import {AddScreen} from '../add/add';
import {ListScreen} from '../list/list';
import {CalendarScreen} from '../calendar/calendar';
import {Config} from '../../config.service';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit {

  @ViewChild('navTabs') tabRef: Tabs;

  tab1Root = AddScreen;
  tab2Root = ListScreen;
  tab3Root = CalendarScreen;

  activeEvents = 0;
  prompt;

  constructor(
    private alertCtrl: AlertController,
    private eventService: EventsService,
    private translate: TranslateService,
    private config: Config,
    private push: PushService,
    private cd: ChangeDetectorRef
  ) {
    this.eventService.onEventsChange.subscribe((evts) => {
      this.activeEvents = evts.filter( (e) => TabsPage.checkActive(e.datestamp)).length;
      this.cd.detectChanges();
    });
  }

  private static checkActive(datestamp: string) {
    return parseInt(datestamp) > new Date().setSeconds(0,0)
  }

  ngOnInit() {
    setInterval(() => {
      this.activeEvents = this.eventService.get().filter( (e) => TabsPage.checkActive(e.datestamp)).length;
      this.cd.detectChanges();
    }, this.config.INTERVAL);
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

  ionViewWillEnter() {
    this.activeEvents = this.eventService.get().filter( (e) => TabsPage.checkActive(e.datestamp)).length;
    this.cd.detectChanges();
  }

}
