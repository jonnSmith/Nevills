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

  presentActionSheet() {
    const translateSubscription = this.translate.get(['cancel', 'changelang', 'langs']).subscribe(t => {
      let buttons = [];
      for(let key of this.config.LANGUAGES) {
        buttons.push({
          text: t.langs[key],
          handler: () => {
            localStorage.setItem(this.config.LANG_KEY, key);
            this.translate.use(key);
            translateSubscription.unsubscribe();
          }
        });
      }
      buttons.push({
        text: t.cancel,
        role: 'cancel',
        handler: () => {
          translateSubscription.unsubscribe();
        }
      });
      const actionSheet = this.actionSheetCtrl.create({
        title: t.changelang,
        buttons: buttons
      });
      actionSheet.present();
    });
  }

}
