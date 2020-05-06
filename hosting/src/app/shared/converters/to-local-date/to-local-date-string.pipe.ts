import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toLocalDateString'
})
export class ToLocalDateStringPipe implements PipeTransform {
  transform(value: Date): string {
    return `${value
      .getDate()
      .toString()
      .padStart(2, '0')}.${(value.getMonth() + 1).toString().padStart(2, '0')}.${value.getFullYear()}`;
  }
}
