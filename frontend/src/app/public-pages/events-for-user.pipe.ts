import { Pipe, PipeTransform } from '@angular/core';
import { Event } from '../interfaces';
import { AuthGuard } from '../shared/services/auth.guard';

@Pipe({ name: 'eventsForUser' })
export class EventsForUserPipe implements PipeTransform {

  constructor(private auth: AuthGuard) { }

  transform(list: any[]): any[] {
    if (this.auth.user.getValue() && list) {
      return list.filter(elem => elem.participants.filter(el => el.person._id === this.auth.user.getValue()._id).length > 0);
    } else {
      return [];
    }
  }

}
