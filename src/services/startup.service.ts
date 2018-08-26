import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Storage} from '@ionic/storage';
import {Platform} from 'ionic-angular';
import {FCM} from '@ionic-native/fcm';
import {LocalNotifications} from '@ionic-native/local-notifications';
import {EventsService} from './events.service';

const DEFAULT_LANGUAGE = 'ru';
const STORAGE_FCM_TOKEN_KEY = "nvls_fcm_token";

/**
 * Startup service.
 */
@Injectable()
export class StartupService {
  constructor(private storage: Storage,
              private platform: Platform,
              private translate: TranslateService,
              private events: EventsService,
              private localNotifications: LocalNotifications,
              private fcm: FCM) {
  }

  /**
   * Main application initialization routine. Called before angular app starts
   * @returns {Promise<any>}
   */
  public init(): Promise<any> {
    return new Promise( (res) => {
      this.platform.ready().then(() => {
        return this.initTranslation();
      }).then(() => {
        if(window['cordova']) {
          return this.fcm.getToken();
        } else {
          return new Promise ((res) => res('browser'));
        }
      }).then((token) => {
        console.log('FCM', token);
        this.storage.set(STORAGE_FCM_TOKEN_KEY, token);
        return this.events.init();
      }).then((events: Number) => {
        if (events) {
          this.localNotifications.schedule({
            text: 'Events saved: ' + events
          });
        }
        res();
      })
    });

  }

  /**
   * Iniyialize tranlsations
   * @returns {Promise<any>}
   */
  public initTranslation(): Promise<any> {
    this.translate.addLangs(['en', 'ru']);
    this.translate.setDefaultLang(DEFAULT_LANGUAGE);
    return this.translate.use(DEFAULT_LANGUAGE).toPromise();
  }

}
