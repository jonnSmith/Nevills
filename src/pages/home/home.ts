import {Component} from '@angular/core';
import {AlertController} from 'ionic-angular';
import {EventsService} from '../../services/events.service';
import {iEvent} from '../../interfaces/event.interface';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public event: iEvent;

  constructor(
    private eventService: EventsService,
    private alertCtrl: AlertController
  ) {
    this.event = this.eventService.getDummy();
    this.eventService.onEventsChange.subscribe((evts) => {
      this.event = this.eventService.getDummy();
    });
  }

  addEvent() {
    const prompt = this.alertCtrl.create({
      title: 'Save event '+this.event.title+ '?',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Save',
          handler: () => {
            this.eventService.push(this.event);
          }
        }
      ]
    });
    prompt.present();
  }

}
