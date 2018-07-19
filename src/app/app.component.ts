import {Component} from '@angular/core';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StartupService} from '../services/startup.service';
import {TabsPage} from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private start: StartupService) {
    this.start.init().then( () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}