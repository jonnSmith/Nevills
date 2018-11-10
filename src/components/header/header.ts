import {Component, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActionSheetController} from 'ionic-angular';
import {Config} from '../../config.service';

@Component({
  selector: 'header-component',
  templateUrl: 'header.html'
})
export class HeaderComponent {

  @Input('title') title: string;
  language: true;

  constructor(
    private config: Config,
    private translate: TranslateService,
    private actionSheetCtrl: ActionSheetController) {

  }

  setLanguage(lang) {
    this.translate.use(lang);
  }

  presentActionSheet() {
    const translateSubscription = this.translate.get(['cancel', 'changelang']).subscribe(t => {
      const actionSheet = this.actionSheetCtrl.create({
        title: t.changelang,
        buttons: [
          {
            text: 'Russian',
            handler: () => {
              localStorage.setItem(this.config.LANG_KEY, 'ru');
              this.translate.use('ru');
              translateSubscription.unsubscribe();
            }
          }, {
            text: 'English',
            handler: () => {
              localStorage.setItem(this.config.LANG_KEY, 'en');
              this.translate.use('en');
              translateSubscription.unsubscribe();
            }
          }, {
            text: t.cancel,
            role: 'cancel',
            handler: () => {
              translateSubscription.unsubscribe();
            }
          }
        ]
      });
      actionSheet.present();
    });
  }

}
