/* SystemJS module definition */

interface Navigator {
    notification: {
        alert: Function;
        confirm: Function;
        prompt: Function;
        beep: Function;
    };
    connection: any;
    camera: any;
}

declare var cordova: any;
declare var plugins: any;
declare var navigator: Navigator;
declare var PushNotification: any;
declare var FCMPlugin: any;
declare var Camera: any;
