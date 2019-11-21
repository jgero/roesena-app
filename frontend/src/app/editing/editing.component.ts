import { Component } from '@angular/core';
import { trigger, transition, query, style, animate } from '@angular/animations';
import { Observable, of } from 'rxjs';

import { GroupsGQL } from '../GraphQL/query-services/all-groups-gql.service';
import { map } from 'rxjs/operators';
import { EventsShallowGQL } from '../GraphQL/query-services/events/all-events-shallow-gql.service';
import { ShallowArticlesGQL } from '../GraphQL/query-services/articles/all-articles-shallow-gql.service';

@Component({
  selector: 'app-editing',
  templateUrl: './editing.component.html',
  styleUrls: ['./editing.component.scss'],
  animations: [
    trigger('barAnimation', [
      transition('void => *', [
        query(
          ':self',
          [
            style({ transform: 'translateX(-100%)', opacity: 0 }),
            animate('0.2s', style({ transform: 'translateX(0)', opacity: 1 }))
          ],
          {
            optional: true
          }
        )
      ])
    ])
  ]
})
export class EditingComponent {
  public groupList: Observable<{ _id: string; value: string }[]>;

  public navConfig = [
    {
      title: 'Personen',
      path: 'persons',
      list: of([])
    },
    {
      title: 'Gruppen',
      path: 'groups',
      list: this.groupsGql.watch().valueChanges.pipe(map(el => el.data.groups.map(grp => ({ _id: grp._id, value: grp.name }))))
    },
    {
      title: 'Events',
      path: 'events',
      list: this.eventsGql.watch().valueChanges.pipe(map(el => el.data.events.map(el => ({ _id: el._id, value: el.title }))))
    },
    {
      title: 'Artikel',
      path: 'articles',
      list: this.articlesGql.watch().valueChanges.pipe(map(el => el.data.articles.map(el => ({ _id: el._id, value: el.title }))))
    },
    {
      title: 'Bilder',
      path: 'images',
      list: of([])
    }
  ];

  constructor(private groupsGql: GroupsGQL, private eventsGql: EventsShallowGQL, private articlesGql: ShallowArticlesGQL) {}
}
