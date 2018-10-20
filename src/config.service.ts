import {Injectable} from '@angular/core';

@Injectable()
export class Config {
  public backend = {
    // host: "https://nevills.herokuapp.com/",
    host: "http://localhost:8080",
    cache_key: 'nevills-cache',
    api: {
      layer: "/events/"
    },
    params: {
      appId: 'com.nevills.rememberball'
    },
    headers: {
      'app-id': 'com.nevills.rememberball'
    }
  };
  public NOTIFICATIONS_INTERVAL = 60000;
  public DEFAULT_LANGUAGE = "ru";
  public LANGUAGES = ['en', 'ru'];
  public EVENTS_STORAGE_KEY = "nvls_evts";
  public STORAGE_FCM_TOKEN_KEY = "nvls_fcm_token";
  public CAMERA_OPTIONS = {
    quality: 80,
    saveToPhotoAlbum: false,
    targetWidth: 500,
    targetHeight: 500,
    allowEdit: false
  };
  public CALENDAR_CONFIG = {
    editable: true,
    eventLimit: false,
    header: {
      left: 'prev,next',
      center: 'title',
      right: 'month,listMonth',
    }
  };
  public DUMMY_LIST_ITEM = '...';
  public DUMMY_PHOTO_HASH = 'data:image/jpeg;base64,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';
}
