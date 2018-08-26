import {Component, OnInit} from '@angular/core';
import {AlertController, NavParams} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {EventsService} from '../../services/events.service';
import {iEvent} from '../../interfaces/event.interface';

const DUMMY_LIST_ITEM = '...';

const CAMERA_OPTIONS = {
  quality: 80,
  saveToPhotoAlbum: false,
  targetWidth: 500,
  targetHeight: 500,
  allowEdit: false
};

@Component({
  selector: 'event',
  templateUrl: 'event.html'
})
export class EventScreen implements OnInit {

  public event: iEvent;
  public edit = false;
  private options: CameraOptions;

  constructor(
    private camera: Camera,
    private eventService: EventsService,
    private alertCtrl: AlertController,
    private params: NavParams
  ) {
    this.options = CAMERA_OPTIONS;
  }

  ngOnInit() {
    const id = this.params.get('id');
    this.event = this.eventService.getEvent(id);
  }

  takePhoto() {
    this.camera.getPicture(this.options).then((imageData) => {
      this.event.photo = 'data:image/jpeg;base64,' + imageData;
    });
  }

  saveEvent() {
    const prompt = this.alertCtrl.create({
      title: 'Update event '+this.event.title+ '?',
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
            this.eventService.put(this.event);
            this.edit = false;
          }
        }
      ]
    });
    prompt.present();
  }

  setEdit() {
    this.edit = true;
  }

  addListItem() {
    this.event.list[this.event.list.length] = DUMMY_LIST_ITEM;
  }

}
