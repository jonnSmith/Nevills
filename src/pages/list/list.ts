import {Component, ChangeDetectorRef, OnInit, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {EventsService} from '../../services/events.service';
import {AlertController, NavController, LoadingController} from 'ionic-angular';
import {ISubscription} from 'rxjs/Subscription';
import {iEvent} from '../../interfaces/event.interface';
import {EventScreen} from '../event/event';
import {Config} from '../../config.service';

@Component({
  selector: 'list',
  templateUrl: 'list.html'
})
export class ListScreen implements OnInit, OnDestroy {

  // Dummy photo hex from config for photo placeholder
  public dummyPhoto: String;
  public events:Array<iEvent> = [];
  // Datestamp object for pipe check
  public datestamp = new Date().setSeconds(0,0);

  // Array for subscriptions
  private _subscriptions: ISubscription[] = [];

  constructor(private loading: LoadingController,
              private translate: TranslateService,
              private config: Config,
              private eventService: EventsService,
              private alertCtrl: AlertController,
              private nav: NavController,
              private cd: ChangeDetectorRef
  ) {
    this.dummyPhoto = this.config.DUMMY_PHOTO_HASH;
    // Subscribe for special emitter from Tabs component to open push event page
    const eventPushedSub = this.eventService.onEventsPushed.subscribe((id) => {
      this.nav.popToRoot();
      this.nav.push(EventScreen, {id: id});
    });
    this._subscriptions.push(eventPushedSub);
  }

  private static sortEvents(a: iEvent, b: iEvent) {
    if (parseInt(a.datestamp) > parseInt(b.datestamp)) return -1;
    else if (parseInt(a.datestamp) < parseInt(b.datestamp)) return 1;
    else return 0;
  }

  ngOnInit() {
    const eventsSub = this.eventService.onEventsChange.subscribe((evts) => {
      this.events = evts.sort((a: iEvent, b: iEvent) =>  ListScreen.sortEvents(a,b));
      this.cd.detectChanges();
    });
    this._subscriptions.push(eventsSub);
    // Update datestamp object for outdated pipe check
    setInterval(() => {
      this.datestamp = new Date().setSeconds(0,0);
      this.cd.detectChanges();
    }, this.config.INTERVAL);
  }

  /**
   * Update events list on every component display on screen
   */
  ionViewWillEnter() {
    this.events = this.eventService.get().sort((a: iEvent, b: iEvent) =>  ListScreen.sortEvents(a,b));
    this.cd.detectChanges();
  }

  /**
   * Delete event with prompt
   * @param {iEvent} event Event full object to delete
   */
  popEvent(event: iEvent) {
    const translateSubscription = this.translate.get(['delete', 'check', 'cancel', 'wait']).subscribe(t => {
      const prompt = this.alertCtrl.create({
        title: t.delete + ' ' + event.title + '?',
        message: t.check,
        buttons: [
          {
            text: t.cancel,
            handler: () => {
              translateSubscription.unsubscribe();
            }
          },
          {
            text: t.delete,
            handler: () => {
              let loader = this.loading.create({
                content: t.wait
              });
              loader.present();
              // Delete event from backend and local data, dismiss loader after promise fulfilled
              this.eventService.pop(event).then(_ => {
                loader.dismiss();
              });
              translateSubscription.unsubscribe();
            }
          }
        ]
      });
      prompt.present();
    });
  }

  /**
   * Open event on event screen by id
   * @param {String} id Event id to get event object from service
   */
  openEvent(id: String) {
    this.nav.push(EventScreen, { id: id });
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this._subscriptions.map(subscription => subscription.unsubscribe());
  }

}
