import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Platform} from 'ionic-angular';
import {EventsService} from "./events.service";
import {FCM} from '@ionic-native/fcm';
import {Config} from '../config.service';

/**
 * Startup service.
 */
@Injectable()
export class StartupService {
  constructor(private config: Config,
              private platform: Platform,
              private translate: TranslateService,
              private events: EventsService,
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
      }).then((token: string) => {
        console.log('FCM', token);
        localStorage.setItem(this.config.STORAGE_FCM_TOKEN_KEY, token);
        return this.events.init();
      }).then( _ => {
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
