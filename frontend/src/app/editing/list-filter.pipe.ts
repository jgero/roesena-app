import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listFilter'
})
export class ListFilterPipe implements PipeTransform {
  transform(list: { _id: string; value: string }[], searchString: string): { _id: string; value: string }[] {
    if (list) {
      return list.filter(elem => elem.value.toLowerCase().includes(searchString.toLowerCase()));
    } else {
      return [];
    }
  }
}
