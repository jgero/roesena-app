import { Pipe, PipeTransform } from '@angular/core';
import { Event } from '../../interfaces';
import { AuthGuard } from '../../shared/services/auth.guard';

@Pipe({ name: 'eventsFilter' })
export class EventsFilterPipe implements PipeTransform {
  constructor(private auth: AuthGuard) {}

  transform(list: Event[], personal: boolean, searchString: string): Event[] {
    if (personal) {
      list = list.filter(elem => elem.participants.filter(el => el.person._id === this.auth.user.getValue()._id).length > 0);
    }
    if (searchString && searchString !== '' && list) {
      list = list.filter(
        elem =>
          elem.title.toLowerCase().includes(searchString.toLowerCase()) ||
          elem.description.toLowerCase().includes(searchString.toLowerCase())
      );
    }
    return list;
  }
}
