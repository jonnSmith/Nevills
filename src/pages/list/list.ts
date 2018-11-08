import {Component, ChangeDetectorRef} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {EventsService} from '../../services/events.service';
import {AlertController, NavController, LoadingController} from 'ionic-angular';
import {iEvent} from '../../interfaces/event.interface';
import {EventScreen} from '../event/event';
import {Config} from '../../config.service';

@Component({
  selector: 'list',
  templateUrl: 'list.html'
})
export class ListScreen {

  public dummyPhoto: String;
  public events:Array<iEvent> = [];
  public datestamp = new Date().setSeconds(0,0);

  constructor(private loading: LoadingController,
              private translate: TranslateService,
              private config: Config,
              private eventService: EventsService,
              private alertCtrl: AlertController,
              private nav: NavController,
              private cd: ChangeDetectorRef
  ) {
    this.dummyPhoto = this.config.DUMMY_PHOTO_HASH;
    this.events = this.eventService.get().sort((a: iEvent, b: iEvent) =>  ListScreen.sortEvents(a,b));
    this.eventService.onEventsChange.subscribe((evts) => {
      this.events = evts.sort((a: iEvent, b: iEvent) =>  ListScreen.sortEvents(a,b));
      this.cd.detectChanges();
    });
    setInterval(() => {
      this.datestamp = new Date().setSeconds(0,0);
      this.cd.detectChanges();
    }, 30000);
  }

  private static sortEvents(a: iEvent, b: iEvent) {
    if (parseInt(a.datestamp) > parseInt(b.datestamp)) return -1;
    else if (parseInt(a.datestamp) < parseInt(b.datestamp)) return 1;
    else return 0;
  }

  ionViewWillEnter() {
    this.events = this.eventService.get().sort((a: iEvent, b: iEvent) =>  ListScreen.sortEvents(a,b));
    this.cd.detectChanges();
  }

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

  openEvent(id: String) {
    this.nav.push(EventScreen, { id: id });
  }

}
