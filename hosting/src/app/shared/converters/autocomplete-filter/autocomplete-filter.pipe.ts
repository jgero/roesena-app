import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'autocompleteFilter',
})
export class AutocompleteFilterPipe implements PipeTransform {
  transform(value: string[], substring: string, alreadySelected?: string[]): string[] {
    // lowercase of string -> split into array -> add regex for any symbol behind every char
    //  -> join togehter -> add regex for any char in front
    const substringRegex = new RegExp(
      substring
        .toLowerCase()
        .split('')
        .map((c) => c.concat('.*'))
        .join('')
        .replace(/^/, '.*')
    );
    if (value) {
      // filter out all the already selected items
      if (alreadySelected) {
        value = value.filter((el) => !alreadySelected.includes(el));
      }
      // filter out all the times which do not contain the substring
      return value.filter((val) => substringRegex.test(val.toLowerCase())).filter((_, i) => i < 10);
    } else {
      return [];
    }
  }
}
