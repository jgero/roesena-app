import { Pipe, PipeTransform } from '@angular/core';
import { AppPerson, Participant } from '@utils/interfaces';

@Pipe({
  name: 'participantAutocompleteFilter',
})
export class ParticipantAutocompleteFilterPipe implements PipeTransform {
  transform(completeList: AppPerson[], substring: string, participants: Participant[]): AppPerson[] {
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
    if (completeList) {
      // keep only the persons, which are not participants
      completeList = completeList.filter((el) => !participants.find((p) => p.id === el.id));
      // filter out all the times which do not contain the substring
      return completeList.filter((val) => substringRegex.test(val.name.toLowerCase())).filter((_, i) => i < 10);
    } else {
      return [];
    }
  }
}
