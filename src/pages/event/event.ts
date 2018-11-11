import {Component, OnInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {FormGroup,FormArray,FormBuilder,Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {AlertController, NavParams, NavController, LoadingController} from 'ionic-angular';
import {ISubscription} from 'rxjs/Subscription';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {EventsService} from '../../services/events.service';
import {iEvent, iTodo, emptyTodo} from '../../interfaces/event.interface';
import {Config} from '../../config.service';
import {timeValidator} from "../../validators/time.validator";

@Component({
  selector: 'event',
  templateUrl: 'event.html'
})

/**
 * Event object information display and edit screen component
 */
export class EventScreen implements OnInit, OnDestroy {

  // Dummy photo hex from config for photo placeholder
  public dummyPhoto: String;

  public event: iEvent;
  public edit = false;
  private options: CameraOptions;
  private editEventForm: FormGroup;

  // Array for subscriptions
  private _subscriptions: ISubscription[] = [];

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
    // Subscribe to events change emitter for close page after delete event or add new
    const eventsSub = this.eventService.onEventsChange.subscribe(_ => {
      this.nav.popToRoot();
    });
    this._subscriptions.push(eventsSub);
  }

  /**
   * Get event by id on component init
   */
  ngOnInit() {
    const id = this.params.get('id');
    this.event = this.eventService.getEvent(id);
    // Exit on unreachable data or wrong id
    if(!this.event) this.nav.popToRoot();
    this.setFromGroup();
    // Update validator for time field to disable adding outdated event
    setInterval(()=> { this.editEventForm.controls['time'].updateValueAndValidity(); }, this.config.INTERVAL);
  }

  /**
   * Change edit / info screen info
   */
  setEdit() {
    this.edit = true;
    this.cd.detectChanges();
  }

  /**
   * Create dynamic form with extendable list and time custom validator and fill with event data
   */
  setFromGroup() {
    let evt = {...this.event};
    let listArray = evt.list.length ? evt.list.map((i: iTodo) => this.setListItem(i)) : [this.setListItem(emptyTodo)];
    this.editEventForm = this.formBuilder.group({
      title: [evt.title, Validators.required],
      description: [evt.description, Validators.required],
      start: [evt.start, [Validators.required]],
      time: [evt.time, [Validators.required, timeValidator('start')]],
      photo: [evt.photo],
      list: this.formBuilder.array(listArray)
    });
  }

  /**
   * Set list item group with saved data from event
   * @param {iTodo} line Item object
   * @returns {FormGroup} Form group for list control
   */
  setListItem(line: iTodo) {
    return this.formBuilder.group(line);
  }

  /**
   * Add list item form group to list control
   */
  addListItem() {
    const control = < FormArray > this.editEventForm.controls['list'];
    control.push(this.setListItem(emptyTodo));
    this.cd.detectChanges();
  }

  /**
   * Remove list item from list
   * @param {number} i Item index in list array
   */
  removeListItem(i: number) {
    const control = < FormArray > this.editEventForm.controls['list'];
    control.removeAt(i);
    this.cd.detectChanges();
  }

  /**
   * Reflect checked flag variable on click
   * @param {number} i Item index in list array
   */
  switchTodoListItem(i: number) {
    const control = < FormArray > this.editEventForm.controls['list'];
    let itemValue: iTodo = {...control.value[i]};
    itemValue.checked = !itemValue.checked;
    control.at(i).patchValue(itemValue);
    this.cd.detectChanges();
  }

  /**
   * Take photo from camera and pass saved path on device to form field
   */
  takePhoto() {
    if(window['cordova']) {
      this.camera.getPicture(this.options).then((imageData) => {
        this.editEventForm.controls['photo'].patchValue(imageData);
        this.cd.detectChanges();
      });
    }
  }

  /**
   * Delete event with prompt
   */
  popEvent() {
    const translateSubscription = this.translate.get(['delete', 'check', 'cancel', 'wait']).subscribe(t => {
      const prompt = this.alertCtrl.create({
        title: t.delete + ' ' + this.event.title + '?',
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
              // Delete event from backend and local data, update UI after promise fulfilled
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

  /**
   * Update event with new data with prompt
   */
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
                // Update event on backend and local data, clear form, update UI and events array after promise fulfilled
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

  /**
   * Unsubscribe from all subscriptions after component destroy
   */
  ngOnDestroy() {
    this._subscriptions.map(subscription => subscription.unsubscribe());
  }

}
