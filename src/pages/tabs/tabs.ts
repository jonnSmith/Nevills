import {Component, ViewChild, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AlertController, Tabs} from 'ionic-angular';
import {ISubscription} from 'rxjs/Subscription';
import {EventsService} from "../../services/events.service";
import {PushService} from "../../services/push.service";
import {AddScreen} from '../add/add';
import {ListScreen} from '../list/list';
import {CalendarScreen} from '../calendar/calendar';
import {Config} from '../../config.service';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit, OnDestroy {

  @ViewChild('navTabs') tabRef: Tabs;

  tab1Root = AddScreen;
  tab2Root = ListScreen;
  tab3Root = CalendarScreen;

  // Active events counter for tab badge
  activeEvents = 0;
  prompt;

  // Array for subscriptions
  private _subscriptions: ISubscription[] = [];

  constructor(
    private alertCtrl: AlertController,
    private eventService: EventsService,
    private translate: TranslateService,
    private config: Config,
    private push: PushService,
    private cd: ChangeDetectorRef
  ) {
    // Subscribe for update active events counter
    const eventsSub = this.eventService.onEventsChange.subscribe((evts) => {
      this.activeEvents = evts.filter( (e) => TabsPage.checkActive(e.datestamp)).length;
      this.cd.detectChanges();
    });
    this._subscriptions.push(eventsSub);
  }

  /**
   * Check function for filter outdated events
   * @param {string} datestamp
   * @returns {boolean}
   */
  private static checkActive(datestamp: string) {
    return parseInt(datestamp) > new Date().setSeconds(0,0)
  }

  /**
   * Refresh outdated filter interval call and push subscription for open push event with prompt
   */
  ngOnInit() {
    //Interval setup for refresh outdated events filter with actual datestamp
    setInterval(() => {
      this.activeEvents = this.eventService.get().filter( (e) => TabsPage.checkActive(e.datestamp)).length;
      this.cd.detectChanges();
    }, this.config.INTERVAL);


    // Subscribe for incoming push additional data to ask and open event from push
    const pushSub = this.push.onPush.subscribe((data) => {
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
                  // Select tab call to emit event screen open function from list component after promise fulfilled
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
    this._subscriptions.push(pushSub);
  }

  /**
   * Update active events counter on every component open
   */
  ionViewWillEnter() {
    this.activeEvents = this.eventService.get().filter( (e) => TabsPage.checkActive(e.datestamp)).length;
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this._subscriptions.map(subscription => subscription.unsubscribe());
  }

}
