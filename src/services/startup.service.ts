import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Storage} from '@ionic/storage';
import {Platform} from 'ionic-angular';
import {FCM} from '@ionic-native/fcm';
import {LocalNotifications} from '@ionic-native/local-notifications';
import {EventsService} from './events.service';
import {iEvent} from '../interfaces/event.interface';
import {Config} from '../config.service';

/**
 * Startup service.
 */
@Injectable()
export class StartupService {
  constructor(private config: Config,
              private storage: Storage,
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
        this.storage.set(this.config.STORAGE_FCM_TOKEN_KEY, token);
        return this.events.init();
      }).then((events: Array<iEvent>) => {
        if (events) {
          this.localNotifications.schedule({
            text: 'Events saved: ' + events.length
          });
        }
        res();
      })
    });

  }

  /**
   * Initialize tranlsations
   * @returns {Promise<any>}
   */
  public initTranslation(): Promise<any> {
    this.translate.addLangs(this.config.LANGUAGES);
    this.translate.setDefaultLang(this.config.DEFAULT_LANGUAGE);
    return this.translate.use(this.config.DEFAULT_LANGUAGE).toPromise();
  }

}
