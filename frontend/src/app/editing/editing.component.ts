import { Component } from '@angular/core';
import { trigger, transition, query, style, animate } from '@angular/animations';
import { Observable } from 'rxjs';

import { GroupsGQL } from '../GraphQL/query-services/all-groups-gql.service';
import { map } from 'rxjs/operators';
import { PersonsGQL } from '../GraphQL/query-services/all-persons-gql.service';

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
      list: this.personsGql.watch().valueChanges.pipe(map(el => el.data.persons.map(per => ({ _id: per._id, value: per.name }))))
    },
    {
      title: 'Gruppen',
      path: 'groups',
      list: this.groupsGql.watch().valueChanges.pipe(map(el => el.data.groups.map(grp => ({ _id: grp._id, value: grp.name }))))
    }
  ];

  constructor(private personsGql: PersonsGQL, private groupsGql: GroupsGQL) {
    // this.groupList = ;
  }
}
