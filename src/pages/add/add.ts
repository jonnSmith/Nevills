import {Component} from '@angular/core';
import {AlertController, Tabs} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {EventsService} from '../../services/events.service';
import {iEvent} from '../../interfaces/event.interface';

const DUMMY_LIST_ITEM = '...';

@Component({
  selector: 'add',
  templateUrl: 'add.html'
})
export class AddScreen {

  public event: iEvent;
  private options: CameraOptions;

  constructor(private camera: Camera,
              private eventService: EventsService,
              private alertCtrl: AlertController,
              private tabs:Tabs) {
    this.event = this.eventService.getDummy();
    this.options = {
      quality: 80,
      saveToPhotoAlbum: false,
      targetWidth: 500,
      targetHeight: 500,
      allowEdit: false
    }
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
    this.event.list[this.event.list.length] = DUMMY_LIST_ITEM;
  }

}
