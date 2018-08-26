import {Component} from '@angular/core';
import {AlertController, Tabs} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {EventsService} from '../../services/events.service';
import {iEvent} from '../../interfaces/event.interface';
import {Config} from '../../config.service';

@Component({
  selector: 'add',
  templateUrl: 'add.html'
})
export class AddScreen {

  public event: iEvent;
  private options: CameraOptions;

  constructor(private config: Config,
              private camera: Camera,
              private eventService: EventsService,
              private alertCtrl: AlertController,
              private tabs:Tabs) {
    this.event = this.eventService.getDummy();
    this.options = this.config.CAMERA_OPTIONS;
  }

  takePhoto() {
    this.camera.getPicture(this.options).then((imageData) => {
      console.log('imageData', imageData);
      this.event.photo = 'data:image/jpeg;base64,' + imageData;
    });
  }

  addEvent() {
    const prompt = this.alertCtrl.create({
      title: 'Save event ' + this.event.title + '?',
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
            this.event = this.eventService.getDummy();
            this.eventService.push(this.event);
            this.tabs.select(1);
          }
        }
      ]
    });
    prompt.present();
  }

  addListItem() {
    this.event.list[this.event.list.length] = this.config.DUMMY_LIST_ITEM;
  }

}
