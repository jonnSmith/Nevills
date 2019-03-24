import {Component, ChangeDetectorRef, OnInit, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {EventsService} from '../../services/events.service';
import {AlertController, NavController, LoadingController} from 'ionic-angular';
import {ISubscription} from 'rxjs/Subscription';
import {iEvent} from '../../interfaces/event.interface';
import {EventScreen} from '../event/event';
import {Config, EventTypes} from '../../config.service';

/**
 * Events list display screen
 */
@Component({
  selector: 'list',
  templateUrl: 'list.html'
})
export class ListScreen implements OnInit, OnDestroy {

  // Dummy photo hex from config for photo placeholder
  public dummyPhoto: String;
  public events: Array<iEvent> = [];
  // Datestamp object for pipe check
  public datestamp = new Date().setSeconds(0,0);

  // Array for subscriptions
  private _subscriptions: ISubscription[] = [];

  // Event types enum for filter outadet/actual events
  public eventTypes = EventTypes;
  public selectedEventType = EventTypes.ACTUAL;

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
    // Set selected event type from saved in config
    this.selectedEventType = this.config.SELECTED_EVENT_TYPE;
  }

  /**
   * Sort events by datetime
   * @param {iEvent} a First comparing event
   * @param {iEvent} b Second comparing event
   * @returns {number} -1 if first is newer, 1 if older, 0 if same
   */
  private static sortEvents(a: iEvent, b: iEvent) {
    if (parseInt(a.datestamp) > parseInt(b.datestamp)) return -1;
    else if (parseInt(a.datestamp) < parseInt(b.datestamp)) return 1;
    else return 0;
  }

  /**
   * Subscribe for events changing and set interval for actual datestamp
   */
  ngOnInit() {
    // Subscribe on events changed for list display update
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
   * Segment click event, save selected eevent type and update UI
   */
  segmentChanged() {
    localStorage.setItem(this.config.TYPE_KEY, this.selectedEventType);
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

  /**
   * Unsubsidised from all subscriptions
   */
  ngOnDestroy() {
    this._subscriptions.map(subscription => subscription.unsubscribe());
  }

}
