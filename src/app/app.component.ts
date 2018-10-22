import {Component} from '@angular/core';
import {LoadingController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StartupService} from '../services/startup.service';
import {TabsPage} from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class NevillsApp {
  rootPage: any = TabsPage;

  constructor(private loading: LoadingController,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private start: StartupService) {
    let loader = this.loading.create({
      content: 'Please wait...'
    });
    loader.present();
    this.start.init().then( () => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      loader.dismiss();
    });
  }
}
