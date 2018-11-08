import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
import {FormGroup,FormArray,FormBuilder,Validators} from '@angular/forms';
import {AlertController, LoadingController, Tabs} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {EventsService} from '../../services/events.service';
import {Config} from '../../config.service';

@Component({
  selector: 'add',
  templateUrl: 'add.html'
})
export class AddScreen implements OnInit {

  public dummyPhoto: String;
  private options: CameraOptions;
  private addEventForm: FormGroup;

  constructor(private config: Config,
              private camera: Camera,
              private translate: TranslateService,
              private eventService: EventsService,
              private alertCtrl: AlertController,
              private loading: LoadingController,
              private tabs:Tabs,
              private formBuilder: FormBuilder,
              private datepipe: DatePipe) {
    this.dummyPhoto = this.config.DUMMY_PHOTO_HASH;
    this.options = this.config.CAMERA_OPTIONS;
  }

  ngOnInit() {
    this.addEventForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      start: [this.datepipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
      time: [this.datepipe.transform(new Date(), 'HH:mm'), Validators.required],
      photo: [null],
      list: this.formBuilder.array([this.initItem()])
    });
  }

  initItem() {
    return this.formBuilder.group({
      line: ['']
    });
  }

  ionViewWillEnter() {
    this.addEventForm.controls['start'].patchValue(this.datepipe.transform(new Date(), 'yyyy-MM-dd'));
    this.addEventForm.controls['time'].patchValue(this.datepipe.transform(new Date(), 'HH:mm'));
  }

  takePhoto() {
    if(window['cordova']) {
      this.camera.getPicture(this.options).then((imageData) => {
        this.addEventForm.controls['photo'].patchValue(imageData);
      });
    }
  }

  addEvent() {
    let event = {...this.addEventForm.value};
    if(!this.addEventForm.errors) {
      if(event.list.length) {
        event.list = event.list.filter((i) => i && i.line).map((e) => e.line);
      }
      const translateSubscription = this.translate.get(['save', 'add', 'check', 'cancel', 'wait']).subscribe(t => {
        const prompt = this.alertCtrl.create({
          title: t.add + ' ' + event.title + '?',
          message: t.check,
          buttons: [
            {
              text: t.cancel,
              handler: () => {
                translateSubscription.unsubscribe();
              }
            },
            {
              text: t.add,
              handler: () => {
                let loader = this.loading.create({
                  content: t.wait
                });
                loader.present();
                translateSubscription.unsubscribe();
                this.eventService.push(event).then(_ => {
                  this.addEventForm.reset();
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
      });
    } else {
      console.log('FORM ERROR', this.addEventForm.errors)
    }
  }

  addListItem() {
    const control = < FormArray > this.addEventForm.controls['list'];
    control.push(this.initItem());
  }

  removeListItem(i: number) {
    const control = < FormArray > this.addEventForm.controls['list'];
    control.removeAt(i);
  }

}
