import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {FullCalendarModule} from 'ng-fullcalendar';
import {DatePipe} from '@angular/common'

import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {IonicStorageModule} from '@ionic/storage';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {LocalNotifications} from '@ionic-native/local-notifications';
import {Camera} from '@ionic-native/camera';
import {FCM} from '@ionic-native/fcm';
import {File} from '@ionic-native/file';

import {NevillsApp} from './app.component';

import {HeaderComponent} from '../components/header/header';

import {ListScreen} from '../pages/list/list';
import {CalendarScreen} from '../pages/calendar/calendar';
import {AddScreen} from '../pages/add/add';
import {EventScreen} from '../pages/event/event';
import {TabsPage} from '../pages/tabs/tabs';

import {StartupService} from '../services/startup.service';
import {EventsService} from '../services/events.service';
import {Config} from '../config.service';

/**
 * Translation setup
 */
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    NevillsApp,
    ListScreen,
    CalendarScreen,
    AddScreen,
    EventScreen,
    TabsPage,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FullCalendarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(NevillsApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    NevillsApp,
    ListScreen,
    CalendarScreen,
    AddScreen,
    EventScreen,
    TabsPage,
    HeaderComponent
  ],
  providers: [
    HttpClient,
    Camera,
    FCM,
    File,
    StatusBar,
    SplashScreen,
    LocalNotifications,
    DatePipe,
    StartupService,
    EventsService,
    Config,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
