import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
import {FormGroup,FormArray,FormBuilder,Validators} from '@angular/forms';
import {AlertController, LoadingController, Tabs} from 'ionic-angular';
import {ISubscription} from 'rxjs/Subscription';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {EventsService} from '../../services/events.service';
import {Config} from '../../config.service';
import {timeValidator} from "../../validators/time.validator";
import {emptyTodo} from "../../interfaces/event.interface";

@Component({
  selector: 'add',
  templateUrl: 'add.html'
})

/**
 * Add screen component with new event post form
 */
export class AddScreen implements OnInit, OnDestroy {

  // Dummy photo hex from config for photo placeholder
  public dummyPhoto: String;
  private options: CameraOptions;
  private addEventForm: FormGroup;

  private _subscriptions: ISubscription[] = [];

  constructor(private config: Config,
              private camera: Camera,
              private translate: TranslateService,
              private eventService: EventsService,
              private alertCtrl: AlertController,
              private loading: LoadingController,
              private tabs:Tabs,
              private cd: ChangeDetectorRef,
              private formBuilder: FormBuilder,
              private datepipe: DatePipe) {
    this.dummyPhoto = this.config.DUMMY_PHOTO_HASH;
    this.options = this.config.CAMERA_OPTIONS;
  }

  /**
   * Setup reactive form on init and set interval for update datetime validation with current time
   */
  ngOnInit() {
    this.setupForm();
    // Update validator for time field to disable adding outdated event
    setInterval(()=> { this.addEventForm.controls['time'].updateValueAndValidity(); }, this.config.INTERVAL);
  }

  /**
   * Clear form on every component load
   */
  ionViewWillEnter() {
    this.setupForm();
    this.cd.detectChanges();
  }

  /**
   * Create dynamic form with extendable list and time custom validator
   */
  setupForm() {
    this.addEventForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      start: [this.datepipe.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]],
      time: [this.datepipe.transform(new Date(), 'HH:mm'), [Validators.required, timeValidator('start')]],
      photo: [null],
      list: this.formBuilder.array([this.initItem()])
    });
  }

  /**
   * Create new empty list item
   * @returns {FormGroup} List item form group with empty fields
   */
  initItem() {
    return this.formBuilder.group(emptyTodo);
  }

  /**
   * Add list item form group to list control
   */
  addListItem() {
    const control = < FormArray > this.addEventForm.controls['list'];
    control.push(this.initItem());
    this.cd.detectChanges();
  }

  /**
   * Remove list item from list
   * @param {number} i Item index in list array
   */
  removeListItem(i: number) {
    const control = < FormArray > this.addEventForm.controls['list'];
    control.removeAt(i);
    this.cd.detectChanges();
  }

  /**
   * Take photo from camera and pass saved path on device to form field
   */
  takePhoto() {
    if(window['cordova']) {
      this.camera.getPicture(this.options).then((imageData) => {
        this.addEventForm.controls['photo'].patchValue(imageData);
        this.cd.detectChanges();
      });
    }
  }

  /**
   * Add event with alert prompt
   */
  addEvent() {
    // Deep copy form value to avoid closures
    let event = {...this.addEventForm.value};
    // Check errors
    if(!this.addEventForm.errors) {
      // Get translations by keys
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
                // Push new event to backend and local data, clean form and open tab with events list after promise fulfilled
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
      this._subscriptions.push(translateSubscription);
    } else {
      console.log('FORM ERROR', this.addEventForm.errors)
    }
  }

  /**
   * Unsubsidised from all subscriptions after destroy
   */
  ngOnDestroy() {
    this._subscriptions.map(subscription => subscription.unsubscribe());
  }

}
