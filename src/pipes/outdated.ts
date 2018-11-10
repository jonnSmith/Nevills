import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'outdated',
})

export class OutdatedPipe implements PipeTransform {
  /**
   * Compare number and parsed to int string for datestamp outdated check
   */
  transform(value: string, ...args) {
    return args[0] >= parseInt(value);
  }
}
