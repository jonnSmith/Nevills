import {Component} from '@angular/core';
import {EventsService} from '../../services/events.service';
import {AlertController} from 'ionic-angular';
import {iEvent} from '../../interfaces/event.interface';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  public events:Array<iEvent> = [];

  constructor(
    private eventService: EventsService,
    private alertCtrl: AlertController
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
            this.eventService.pop(event.id);
          }
        }
      ]
    });
    prompt.present();
  }

}
