import { Pipe, PipeTransform } from '@angular/core';
import { Event } from '../interfaces';
import { AuthGuard } from '../shared/services/auth.guard';

@Pipe({ name: 'eventsForUser' })
export class EventsForUserPipe implements PipeTransform {

  constructor(private auth: AuthGuard) { }

  transform(list: Event[]): Event[] {
    if (this.auth.user.getValue() && list) {
      return list.filter(elem => elem.participants.includes(this.auth.user.getValue()._id));
    } else {
      return [];
    }
  }

}
