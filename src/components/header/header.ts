import {Component, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActionSheetController} from 'ionic-angular';

@Component({
  selector: 'header-component',
  templateUrl: 'header.html'
})
export class HeaderComponent {

  @Input('title') title: string;
  language: true;

  constructor(
    private translate: TranslateService,
    private actionSheetCtrl: ActionSheetController) {

  }

  setLanguage(lang) {
    this.translate.use(lang);
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Change language',
      buttons: [
        {
          text: 'Russian',
          handler: () => {
            this.translate.use('ru');
          }
        }, {
          text: 'English',
          handler: () => {
            this.translate.use('en');
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    actionSheet.present();
  }

}
