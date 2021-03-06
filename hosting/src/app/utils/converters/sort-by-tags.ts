import { AppElement } from '@utils/interfaces';

export function sortByTags<T extends AppElement>(originalArray: T[]): T[] {
  return originalArray.sort((aEl, bEl) => {
    // sort tags alphabetically and merge them afterwards
    // the "0" case of the sorting algorithm can be ignored here because an element cannot have two identical tags
    const tagStringA = aEl.tags.sort((a, b) => (a < b ? -1 : 1)).join('');
    const tagStringB = bEl.tags.sort((a, b) => (a < b ? -1 : 1)).join('');
    // compare the tag strings of the elements
    if (tagStringA > tagStringB) {
      return -1;
    }
    if (tagStringA < tagStringB) {
      return 1;
    }
    // here they have identical tags
    return 0;
  });
}
