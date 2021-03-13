import { Pipe, PipeTransform } from '@angular/core';
import { diffChars } from 'diff';

@Pipe({
  name: 'autocompleteFilter',
})
export class AutocompleteFilterPipe implements PipeTransform {
  transform(value: string[], substring: string, alreadySelected?: string[]): string[] {
    if (!value) {
      return [];
    }
    if (alreadySelected) {
      // remove all the elements that are already selected
      value = value.filter((el) => !alreadySelected.includes(el));
    }
    return (
      value
        // calculate diffs
        .map((val) => ({ val, diff: diffChars(substring, val, { ignoreCase: true }) }))
        // map the diff changes to only the amout of the removed chars from the search string to the tag per change
        .map(({ val, diff }) => ({ val, diff: diff.map((diffEl: any) => (diffEl.removed ? diffEl.count : 0)) }))
        // add up the amout of the removed chars from all changes in the diff
        .map(({ val, diff }: { val: string; diff: number[] }) => ({ val, diff: diff.reduce((a, b) => a + b) }))
        // sort the elements by diff distance
        .sort((a, b) => a.diff - b.diff)
        // only keep the value
        .map((el) => el.val)
        .slice(0, 10)
    );
  }
}
