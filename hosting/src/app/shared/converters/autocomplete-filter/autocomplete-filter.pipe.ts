import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'autocompleteFilter',
})
export class AutocompleteFilterPipe implements PipeTransform {
  transform(value: string[], arg: string): string[] {
    // lowercase of string -> split into array -> add regex for any symbol behind every char
    //  -> join togehter -> add regex for any char in front
    const substringRegex = new RegExp(
      arg
        .toLowerCase()
        .split('')
        .map((c) => c.concat('.*'))
        .join('')
        .replace(/^/, '.*')
    );
    if (value) {
      return value.filter((val) => substringRegex.test(val.toLowerCase())).filter((_, i) => i < 10);
    } else {
      return [];
    }
  }
}
