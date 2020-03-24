import { Pipe, PipeTransform } from "@angular/core";

import { appImage } from "src/app/utils/interfaces";

@Pipe({
  name: "filterImagesBySearchString"
})
export class FilterImagesBySearchStringPipe implements PipeTransform {
  transform(values: appImage[], searchString: string): appImage[] {
    return values.filter(
      img =>
        img.title.toLowerCase().includes(searchString.toLowerCase()) ||
        img.tags.some(tag => tag.toLowerCase().includes(searchString.toLowerCase()))
    );
  }
}
