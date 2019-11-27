import { Pipe, PipeTransform } from '@angular/core';
import { Person } from 'src/app/interfaces';

@Pipe({
  name: 'personFilter'
})
export class PersonPipe implements PipeTransform {
  transform(persons: Person[], searchString: string): Person[] {
    if (persons) {
      return persons.filter(elem => elem.name.toLowerCase().includes(searchString.toLowerCase()));
    } else {
      return [];
    }
  }
}
