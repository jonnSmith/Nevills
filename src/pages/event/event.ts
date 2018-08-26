import {Component, OnInit} from '@angular/core';
import {AlertController, NavParams, NavController} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {EventsService} from '../../services/events.service';
import {iEvent} from '../../interfaces/event.interface';
import {Config} from '../../config.service';

@Component({
  selector: 'event',
  templateUrl: 'event.html'
})
export class EventScreen implements OnInit {

  public event: iEvent;
  public edit = false;
  private options: CameraOptions;

  constructor(private config: Config,
              private camera: Camera,
              private eventService: EventsService,
              private alertCtrl: AlertController,
              private params: NavParams,
              private nav: NavController
  ) {
    this.options = this.config.CAMERA_OPTIONS;
  }

  ngOnInit() {
    const id = this.params.get('id');
    this.event = this.eventService.getEvent(id);
  }

  takePhoto() {
    this.camera.getPicture(this.options).then((imageData) => {
      console.log('imageData', imageData);
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
            this.nav.pop();
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
    this.event.list[this.event.list.length] = this.config.DUMMY_LIST_ITEM;
  }

}
