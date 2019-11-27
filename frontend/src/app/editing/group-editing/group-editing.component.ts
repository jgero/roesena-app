import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Person } from 'src/app/interfaces';
import { PersonsGQL } from 'src/app/GraphQL/query-services/all-persons-gql.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { GroupsGQL } from 'src/app/GraphQL/query-services/all-groups-gql.service';
import { GroupGQL } from 'src/app/GraphQL/query-services/group-gql.service';
import { DeleteGroupGQL } from './mutations/deleteGroup-gql.service';
import { NewGroupGQL } from './mutations/newGroup-gql.service';
import { UpdateGroupGQL } from './mutations/updateGroup-gql.service';
import { GlobalSearchService } from 'src/app/public-pages/main/global-search.service';

@Component({
  selector: 'app-group-editing',
  templateUrl: './group-editing.component.html',
  styleUrls: ['./group-editing.component.scss']
})
export class GroupEditingComponent implements OnInit, OnDestroy {
  public name: string = '';
  public members: string[] = [];
  public persons: Observable<Person[]>;

  private subs: Subscription[] = [];

  constructor(
    private groupsGql: GroupsGQL,
    private groupGql: GroupGQL,
    private deleteGrpGql: DeleteGroupGQL,
    private newGrpGql: NewGroupGQL,
    private updateGrpGql: UpdateGroupGQL,
    private personsGql: PersonsGQL,
    private route: ActivatedRoute,
    public search: GlobalSearchService
  ) {
    this.persons = this.personsGql.watch().valueChanges.pipe(map(el => el.data.persons));
    this.subs.push(
      this.route.paramMap.subscribe({
        next: paramMap => {
          if (paramMap.get('id')) {
            this.subs.push(
              this.groupGql.watch({ _id: paramMap.get('id') }).valueChanges.subscribe({
                next: result => {
                  this.name = result.data.group.name;
                  this.members = result.data.group.members.map(el => el._id);
                }
              })
            );
          }
        }
      })
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  save() {
    if (this.route.snapshot.params['id']) {
      // update
      this.subs.push(
        this.updateGrpGql.mutate({ _id: this.route.snapshot.params['id'], name: this.name, members: this.members }).subscribe({
          next: result => {
            if (result.data.updateGroup) {
              this.groupsGql.watch().refetch();
            }
          }
        })
      );
    } else {
      // create
      this.subs.push(
        this.newGrpGql.mutate({ name: this.name, members: this.members }).subscribe({
          next: result => {
            if (result.data.newGroup) {
              this.groupsGql.watch().refetch();
            }
          }
        })
      );
    }
  }

  delete() {
    if (!this.route.snapshot.params['id']) {
      return;
    }
    this.subs.push(
      this.deleteGrpGql.mutate({ _id: this.route.snapshot.params['id'] }).subscribe({
        next: result => {
          if (result.data.deleteGroup) {
            this.groupsGql.watch().refetch();
          }
        }
      })
    );
  }

  toggleMember(id: string) {
    const index = this.members.findIndex(el => el === id);
    if (index === -1) {
      this.members.push(id);
    } else {
      this.members.splice(index, 1);
    }
  }
}
