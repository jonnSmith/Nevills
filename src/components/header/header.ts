import {Component, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActionSheetController} from 'ionic-angular';
import {Config} from '../../config.service';

@Component({
  selector: 'header-component',
  templateUrl: 'header.html'
})
export class HeaderComponent {

  // Title locale key input for display in header with translation
  @Input('title') title: string;

  constructor(
    private config: Config,
    private translate: TranslateService,
    private actionSheetCtrl: ActionSheetController) {

  }

  /**
   * Show translatable locale selection menu by click on menu button
   */
  presentActionSheet() {
    // Get translates by keys subscription
    const translateSubscription = this.translate.get(['cancel', 'changelang', 'langs']).subscribe(t => {
      // Create buttons array with callbacks
      let buttons = [];
      // Set language change buttons from config languages keys
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
      // Add cancel button
      buttons.push({
        text: t.cancel,
        role: 'cancel',
        handler: () => {
          translateSubscription.unsubscribe();
        }
      });
      // Create and present prompt
      const actionSheet = this.actionSheetCtrl.create({
        title: t.changelang,
        buttons: buttons
      });
      actionSheet.present();
    });
  }

}
