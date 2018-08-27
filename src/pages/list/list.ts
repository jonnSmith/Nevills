import {Component} from '@angular/core';
import {EventsService} from '../../services/events.service';
import {AlertController, NavController, LoadingController} from 'ionic-angular';
import {iEvent} from '../../interfaces/event.interface';
import {EventScreen} from '../event/event'

@Component({
  selector: 'list',
  templateUrl: 'list.html'
})
export class ListScreen {

  public events:Array<iEvent> = [];

  constructor(private loading: LoadingController,
              private eventService: EventsService,
              private alertCtrl: AlertController,
              private nav: NavController
  ) {
    this.events = this.eventService.get();
    this.eventService.onEventsChange.subscribe((evts) => {
      this.events = evts;
    });
  }

  popEvent(event: iEvent) {
    const prompt = this.alertCtrl.create({
      title: 'Delete event '+event.title+ '?',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Delete',
          handler: () => {
            let loader = this.loading.create({
              content: 'Please wait...'
            });
            loader.present();
            this.eventService.pop(event.id).then( _ => {
              loader.dismiss();
            });
          }
        }
      ]
    });
    prompt.present();
  }


  openEvent(id: Number) {
    this.nav.push(EventScreen, { id: id });
  }

}
