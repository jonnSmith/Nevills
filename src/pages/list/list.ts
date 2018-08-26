import {Component} from '@angular/core';
import {EventsService} from '../../services/events.service';
import {AlertController, NavController} from 'ionic-angular';
import {iEvent} from '../../interfaces/event.interface';
import {EventScreen} from '../event/event'

@Component({
  selector: 'list',
  templateUrl: 'list.html'
})
export class ListScreen {

  public events:Array<iEvent> = [];

  constructor(
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
            this.eventService.pop(event.id);
          }
        }
      ]
    });
    prompt.present();
  }

  saveEvent(event: iEvent) {
    const prompt = this.alertCtrl.create({
      title: 'Update event '+event.title+ '?',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Update',
          handler: () => {
            this.eventService.put(event);
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
