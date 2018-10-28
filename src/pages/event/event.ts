import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {AlertController, NavParams, NavController, LoadingController} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {EventsService} from '../../services/events.service';
import {iEvent} from '../../interfaces/event.interface';
import {Config} from '../../config.service';

@Component({
  selector: 'event',
  templateUrl: 'event.html'
})
export class EventScreen implements OnInit {

  public dummyPhoto: String;
  public event: iEvent;
  public edit = false;
  private options: CameraOptions;

  constructor(private loading: LoadingController,
              private config: Config,
              private camera: Camera,
              private eventService: EventsService,
              private alertCtrl: AlertController,
              private params: NavParams,
              private nav: NavController,
              private cd: ChangeDetectorRef
  ) {
    this.dummyPhoto = this.config.DUMMY_PHOTO_HASH;
    this.options = this.config.CAMERA_OPTIONS;
  }

  ngOnInit() {
    const id = this.params.get('id');
    this.event = this.eventService.getEvent(id);
  }

  takePhoto() {
    this.camera.getPicture(this.options).then((imageData) => {
      this.event.photo = imageData;
    });
  }

  popEvent() {
    const prompt = this.alertCtrl.create({
      title: 'Delete event '+this.event.title+ '?',
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
            this.eventService.pop(this.event).then( _ => {
              loader.dismiss();
              this.cd.detectChanges();
              this.nav.pop();
            });
          }
        }
      ]
    });
    prompt.present();
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
            let loader = this.loading.create({
              content: 'Please wait...'
            });
            loader.present();
            this.eventService.put(this.event).then( _ => {
              loader.dismiss();
              this.cd.detectChanges();
              this.nav.pop();
            });
          }
        }
      ]
    });
    prompt.present();
  }

  setEdit() {
    this.edit = true;
    this.cd.detectChanges();
  }

  addListItem() {
    this.event.list[this.event.list.length] = this.config.DUMMY_LIST_ITEM;
  }

}
