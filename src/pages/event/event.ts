import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {FormGroup,FormArray,FormBuilder,Validators} from '@angular/forms';
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
  private editEventForm: FormGroup;

  constructor(private loading: LoadingController,
              private config: Config,
              private camera: Camera,
              private eventService: EventsService,
              private alertCtrl: AlertController,
              private params: NavParams,
              private nav: NavController,
              private cd: ChangeDetectorRef,
              private formBuilder: FormBuilder,
  ) {
    this.dummyPhoto = this.config.DUMMY_PHOTO_HASH;
    this.options = this.config.CAMERA_OPTIONS;
  }

  ngOnInit() {
    const id = this.params.get('id');
    this.event = this.eventService.getEvent(id);
    let listArray = this.event.list.length ? this.event.list.map((i) => this.setListItem(i)) : [this.setListItem('')];
    this.editEventForm = this.formBuilder.group({
      title: [this.event.title, Validators.required],
      description: [this.event.description, Validators.required],
      start: [this.event.start, Validators.required],
      time: [this.event.time, Validators.required],
      photo: [this.event.photo],
      list: this.formBuilder.array(listArray)
    });
  }

  setListItem(line: String) {
    return this.formBuilder.group({
      line: [line]
    });
  }

  addListItem() {
    const control = < FormArray > this.editEventForm.controls['list'];
    control.push(this.setListItem(''));
  }

  removeListItem(i: number) {
    const control = < FormArray > this.editEventForm.controls['list'];
    control.removeAt(i);
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
    let event = {...this.editEventForm.value};
    if(!this.editEventForm.errors) {
      if(event.list.length) {
        event.list = event.list.filter((i) => i && i.line).map((e) => e.line);
      }
      const prompt = this.alertCtrl.create({
        title: 'Update event ' + this.event.title + '?',
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
              this.eventService.put(event).then(_ => {
                this.event = {...event};
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
  }

  setEdit() {
    this.edit = true;
    this.cd.detectChanges();
  }

}
