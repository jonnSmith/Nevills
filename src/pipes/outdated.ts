import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'outdated',
})

/**
 * Compare number and parsed to int string for datetime outdated check
 */
export class OutdatedPipe implements PipeTransform {
  transform(value: string, ...args) {
    return args[0] >= parseInt(value);
  }
}
