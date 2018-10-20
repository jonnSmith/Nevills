import {Component, ChangeDetectorRef} from '@angular/core';
import {DatePipe} from '@angular/common'
import {AlertController, LoadingController, Tabs} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {EventsService} from '../../services/events.service';
import {iEvent} from '../../interfaces/event.interface';
import {Config} from '../../config.service';

@Component({
  selector: 'add',
  templateUrl: 'add.html'
})
export class AddScreen {

  public dummyPhoto: String;
  public event: iEvent;
  private options: CameraOptions;

  constructor(private config: Config,
              private camera: Camera,
              private eventService: EventsService,
              private alertCtrl: AlertController,
              private loading: LoadingController,
              private tabs:Tabs,
              private datepipe: DatePipe,
              private cd: ChangeDetectorRef) {
    this.event = this.eventService.getDummy();
    this.dummyPhoto = this.config.DUMMY_PHOTO_HASH;
    this.options = this.config.CAMERA_OPTIONS;
    setInterval(() => {
      const date = new Date();
      this.event.start = this.datepipe.transform(date, 'yyyy-MM-dd');
      this.event.time = this.datepipe.transform(date, 'HH:mm');
      this.cd.detectChanges();
    }, 30000);
  }

  takePhoto() {
    this.camera.getPicture(this.options).then((imageData) => {
      this.event.photo = imageData;
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
            let loader = this.loading.create({
              content: 'Please wait...'
            });
            loader.present();
            this.eventService.push(this.event).then( _ => {
              this.event = this.eventService.getDummy();
              loader.dismiss();
              this.tabs.select(1);
            }, (err) => {
              loader.dismiss();
              console.log('add event error', err);
            });
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
