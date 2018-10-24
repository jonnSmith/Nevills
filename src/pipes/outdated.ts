import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the OutdatedPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'outdated',
})
export class OutdatedPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    return args[0] >= parseInt(value);
  }
}
