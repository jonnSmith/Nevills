import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Platform, AlertController, LoadingController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Keyboard} from '@ionic-native/keyboard';
import {EventsService} from "./events.service";
import {HttpService} from "./http.service";
import {Config} from '../config.service';
import {PushService} from "./push.service";
import {iEvent} from '../state/event/event.model';

/**
 * Startup service.
 */
@Injectable()
export class StartupService {

  // Loader container for check and create loader element only once even in recursion
  private loader;

  constructor(private loading: LoadingController,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private keyboard: Keyboard,
              private config: Config,
              private platform: Platform,
              private translate: TranslateService,
              private events: EventsService,
              private http: HttpService,
              private push: PushService,
              private alertCtrl: AlertController) {
  }

  /**
   * Main application initialization routine. Called on angular app root component loaded
   */
  public init(): void {
    // Set loader if it is not set before
    if(!this.loader) {
      this.loader = this.loading.create();
      this.loader.present();
    }
    // Promise chain for app initialization - device ready, translation, FCM registration, events loaded from storage and device interface setup
    this.platform.ready().then(() => {
      this.http.listenOnlineOffline();
      return this.initTranslation();
    }).then(() => {
      if( !this.http.isOnline ) { throw Error('NO_CONNECTION'); }
      this.push.init();
      return this.push.register();
    }).then((token: string) => {
      if(!token) { throw Error('NO_TOKEN'); }
      console.log('token', token);
      localStorage.setItem(this.config.STORAGE_FCM_TOKEN_KEY, token);
      return this.events.init();
    }).then( (data: Array<iEvent>) => {
      console.log('events', data);
      if (window['cordova']) {
        this.statusBar.styleLightContent();
        this.splashScreen.hide();
        this.keyboard.disableScroll(true);
      }
      this.loader.dismiss();
    }).catch(error => {
      // Display prompt if some in chain goes wrong to recursion retry
      const translateSubscription = this.translate.get(['error', 'retry', 'NO_CONNECTION', 'NO_TOKEN']).subscribe(t => {
        const prompt = this.alertCtrl.create({
          title: t.error,
          message: t[error.message],
          buttons: [
            {
              text: t.retry,
              handler: () => {
                this.init();
                translateSubscription.unsubscribe();
              }
            }
          ]
        });
        prompt.present();
      });
    });
  }

  /**
   * Initialize tranlsations
   * @returns {Promise<any>} Fulfilled on translate config language is setted up
   */
  public initTranslation(): Promise<any> {
    this.translate.addLangs(this.config.LANGUAGES);
    this.translate.setDefaultLang(this.config.DEFAULT_LANGUAGE);
    return this.translate.use(this.config.DEFAULT_LANGUAGE).toPromise();
  }

}
