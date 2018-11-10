import {FormControl} from '@angular/forms';


export function timeValidator (dateFieldKey: string) {

  let thisControl: FormControl;
  let otherControl: FormControl;

  return function matchOtherValidate (control: FormControl) {

    let current = new Date().getTime();

    if (!control.parent) {
      return null;
    }

    if (!thisControl) {
      thisControl = control;
      otherControl = control.parent.get(dateFieldKey) as FormControl;
      otherControl.valueChanges.subscribe(() => {
        thisControl.updateValueAndValidity();
      });
    }

    if (!otherControl) {
      return null;
    }

    let datetime = new Date(otherControl.value + ' ' + thisControl.value).getTime();
    if(datetime <= current) {
      return {
        timeValidator: {
          expired: true
        }
      }
    }
    return null;

  }

}