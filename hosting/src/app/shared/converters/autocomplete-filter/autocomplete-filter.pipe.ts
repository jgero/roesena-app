import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'autocompleteFilter',
})
export class AutocompleteFilterPipe implements PipeTransform {
  transform(value: string[], arg: string): unknown {
    return value.filter((val) => val.toLowerCase().includes(arg.toLowerCase()));
  }
}
