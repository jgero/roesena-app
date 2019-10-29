import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from 'src/app/interfaces';
import { EventsGQL } from 'src/app/GraphQL/query-services/all-events-gql.service';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  public filterEvents: boolean;
  public events: Observable<Event[]>;

  constructor(eventGQL: EventsGQL) {
    this.events = eventGQL.watch().valueChanges.pipe(
      map(el => el.data.events),
      tap(el => console.log(el))
    );
  }

  ngOnInit() {
  }

}
