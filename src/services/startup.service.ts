import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Platform} from 'ionic-angular';

const DEFAULT_LANGUAGE = 'ru';

/**
 * Startup service.
 */
@Injectable()
export class StartupService {
  constructor(private platform: Platform,
              private translate: TranslateService) {
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
        res();
      });
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
