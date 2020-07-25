import { Component, OnInit, Input } from '@angular/core';
import { AppPerson } from '@utils/interfaces';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Store } from '@ngrx/store';
import { State } from '@state/auth/group-manager/reducers/person.reducer';
import { ConfirmPerson, DeletePerson, AddGroup, RemoveGroup } from '@state/auth/group-manager/actions/person.actions';

@Component({
  selector: 'app-person-tile',
  templateUrl: './person-tile.component.html',
  styleUrls: ['./person-tile.component.scss'],
})
export class PersonTileComponent implements OnInit {
  @Input()
  person: AppPerson;
  isLoadingConfirmation = false;
  isLoadingDeletion = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private store: Store<State>) {}

  onAddGroup(id: string, group: string) {
    this.store.dispatch(new AddGroup({ id, group }));
  }

  onRemoveGroup(id: string, group: string) {
    this.store.dispatch(new RemoveGroup({ id, group }));
  }

  onConfrimClick() {
    this.store.dispatch(new ConfirmPerson({ id: this.person.id }));
    this.isLoadingConfirmation = true;
  }

  onDeleteClick() {
    this.store.dispatch(new DeletePerson({ id: this.person.id }));
    this.isLoadingDeletion = true;
  }

  ngOnInit(): void {}
}
