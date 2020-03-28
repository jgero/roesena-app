import { Pipe, PipeTransform } from "@angular/core";

import { appImage } from "src/app/utils/interfaces";

@Pipe({
  name: "filterImagesBySearchString"
})
export class FilterImagesBySearchStringPipe implements PipeTransform {
  transform(values: appImage[], searchString: string): appImage[] {
    if (!Array.isArray(values) || !searchString) return values;
    return values.filter(img => {
      // create a regex for all the words in the search string
      const regexes = searchString.split(" ").map(word => new RegExp(word.toLowerCase()));
      // check if every regex is in at least one of the tags
      return regexes.every(exp => img.tags.some(tag => exp.test(tag.toLowerCase())));
    });
  }
}
