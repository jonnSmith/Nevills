import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {FormGroup,FormArray,FormBuilder,Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {AlertController, NavParams, NavController, LoadingController} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {EventsService} from '../../services/events.service';
import {iEvent, iTodo, emptyTodo} from '../../interfaces/event.interface';
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
              private translate: TranslateService,
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
    this.eventService.onEventsChange.subscribe((evts) => {
      this.nav.popToRoot();
    });
  }

  ngOnInit() {
    const id = this.params.get('id');
    this.event = this.eventService.getEvent(id);
    this.setFromGroup();
  }

  setFromGroup() {
    let evt = {...this.event};
    let listArray = evt.list.length ? evt.list.map((i: iTodo) => this.setListItem(i)) : [this.setListItem(emptyTodo)];
    this.editEventForm = this.formBuilder.group({
      title: [evt.title, Validators.required],
      description: [evt.description, Validators.required],
      start: [evt.start, Validators.required],
      time: [evt.time, Validators.required],
      photo: [evt.photo],
      list: this.formBuilder.array(listArray)
    });
  }

  setListItem(line: iTodo) {
    return this.formBuilder.group(line);
  }

  addListItem() {
    const control = < FormArray > this.editEventForm.controls['list'];
    control.push(this.setListItem(emptyTodo));
    this.cd.detectChanges();
  }

  removeListItem(i: number) {
    const control = < FormArray > this.editEventForm.controls['list'];
    control.removeAt(i);
    this.cd.detectChanges();
  }

  switchTodoListItem(i: number) {
    const control = < FormArray > this.editEventForm.controls['list'];
    let itemValue: iTodo = {...control.value[i]};
    itemValue.checked = !itemValue.checked;
    control.at(i).patchValue(itemValue);
    this.cd.detectChanges();
  }

  takePhoto() {
    if(window['cordova']) {
      this.camera.getPicture(this.options).then((imageData) => {
        this.editEventForm.controls['photo'].patchValue(imageData);
        this.cd.detectChanges();
      });
    }
  }

  popEvent() {
    const translateSubscription = this.translate.get(['delete', 'check', 'cancel', 'wait']).subscribe(t => {
      const prompt = this.alertCtrl.create({
        title:t.delete + ' ' + this.event.title + '?',
        message: t.check,
        buttons: [
          {
            text: t.cancel,
            handler: () => {
              translateSubscription.unsubscribe();
            }
          },
          {
            text: t.delete,
            handler: () => {
              let loader = this.loading.create({
                content: t.wait
              });
              loader.present();
              this.eventService.pop(this.event).then(_ => {
                loader.dismiss();
                this.cd.detectChanges();
              });
              translateSubscription.unsubscribe();
            }
          }
        ]
      });
      prompt.present();
    });
  }

  saveEvent() {
    let event = {...this.editEventForm.value};
    if(!this.editEventForm.errors) {
      const translateSubscription = this.translate.get(['save', 'add', 'check', 'cancel', 'wait']).subscribe(t => {
        const prompt = this.alertCtrl.create({
          title:  t.save + ' ' + event.title + '?',
          message: t.check,
          buttons: [
            {
              text: t.cancel,
              handler: () => {
                translateSubscription.unsubscribe();
              }
            },
            {
              text: t.save,
              handler: () => {
                let loader = this.loading.create({
                  content: t.wait
                });
                loader.present();
                this.eventService.put(event, this.event).then(_ => {
                  this.event = {...event};
                  this.setFromGroup();
                  loader.dismiss();
                  this.cd.detectChanges();
                  translateSubscription.unsubscribe();
                });
              }
            }
          ]
        });
        prompt.present();
      });
    }
  }

  setEdit() {
    this.edit = true;
    this.cd.detectChanges();
  }

}
