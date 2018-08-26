import {Component} from '@angular/core';
import {AlertController} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {EventsService} from '../../services/events.service';
import {iEvent} from '../../interfaces/event.interface';

@Component({
  selector: 'add',
  templateUrl: 'add.html'
})
export class AddScreen {

  public event: iEvent;
  private options: CameraOptions;

  constructor(private camera: Camera,
              private eventService: EventsService,
              private alertCtrl: AlertController) {
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
            this.eventService.push(this.event);
          }
        }
      ]
    });
    prompt.present();
  }

}
