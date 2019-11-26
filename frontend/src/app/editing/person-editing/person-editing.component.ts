import { Component, ViewContainerRef, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { PopupService } from 'src/app/popup/popup.service';
import { AuthGuard } from 'src/app/shared/services/auth.guard';
import { PersonsGQL } from 'src/app/GraphQL/query-services/all-persons-gql.service';
import { ChangePwGQL } from 'src/app/GraphQL/mutation-services/changePw-gql.service';
import { UpdatePersonGQL } from 'src/app/GraphQL/mutation-services/updatePerson-gql.service';
import { NewPersonGQL } from 'src/app/GraphQL/mutation-services/newPerson-gql.service';
import { DeletePersonGQL } from 'src/app/GraphQL/mutation-services/deletePerson-gql.service';
import { Person } from 'src/app/interfaces';
import { GlobalSearchService } from 'src/app/public-pages/main/global-search.service';
import { ActivatedRoute } from '@angular/router';
import { InputComponent } from 'src/app/shared/components/input/input.component';

@Component({
  selector: 'app-person-editing',
  templateUrl: './person-editing.component.html',
  styleUrls: ['./person-editing.component.scss']
})
export class PersonEditingComponent implements OnDestroy {
  private subs: Subscription[] = [];
  public persons: Person[] = [];
  public newPerson = { name: '', authorityLevel: 1 };
  @ViewChild('newPersonInput', { static: true })
  private newPersonInputRef: ElementRef<InputComponent>;

  constructor(
    public search: GlobalSearchService,
    private popServ: PopupService,
    private route: ActivatedRoute,
    private container: ViewContainerRef,
    private authGuard: AuthGuard,
    private personsGQL: PersonsGQL,
    private changePwGQL: ChangePwGQL,
    private updatePersonGQL: UpdatePersonGQL,
    private newPersonGQL: NewPersonGQL,
    private deletePersonGQL: DeletePersonGQL
  ) {
    this.subs.push(
      this.personsGQL
        .watch()
        .valueChanges.pipe(
          // filter out current user for safety
          map(result => result.data.persons.filter(el => el._id !== this.authGuard.user.getValue()._id)),
          catchError(() => {
            this.popServ.flashPopup('Could not load Persons', this.container);
            return of([]);
          })
        )
        .subscribe({
          next: val => (this.persons = val)
        })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  public onDelete() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.popServ.flashPopup('Keine Person ausgewählt!', this.container);
      return;
    }
    this.subs.push(
      this.deletePersonGQL.mutate({ _id: id }).subscribe({
        next: result => this.popServ.flashPopup(result.data.deletePerson ? 'Gelöscht!' : 'Fehler!', this.container),
        error: () => this.popServ.flashPopup('Query Error!', this.container),
        complete: () => this.personsGQL.watch().refetch()
      })
    );
  }

  public onReset() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.popServ.flashPopup('Keine Person ausgewählt!', this.container);
      return;
    }
    this.subs.push(
      this.changePwGQL.mutate({ _id: id, password: '12345' }).subscribe({
        next: result => this.popServ.flashPopup(result.data.changePw ? 'Passwort zurückgesetzt!' : 'Fehler!', this.container),
        error: () => this.popServ.flashPopup('Query error!', this.container)
      })
    );
  }

  public onSave() {
    // get the person with the id of the route
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.createPerson();
      return;
    }
    const data = this.persons.find(person => person._id === id);
    if (!data.name || data.name === '' || !data.authorityLevel) {
      this.popServ.flashPopup('Alles ausfüllen!', this.container);
      return;
    }
    this.subs.push(
      this.updatePersonGQL.mutate({ ...data }).subscribe({
        next: result => this.popServ.flashPopup(result.data.updatePerson ? 'Gespeichert!' : 'Fehler!', this.container),
        error: () => this.popServ.flashPopup('Query error!', this.container),
        complete: () => this.personsGQL.watch().refetch()
      })
    );
  }

  public createPerson() {
    if (!this.newPerson.name || this.newPerson.name === '') {
      this.popServ.flashPopup('Keine Name eingegeben!', this.container);
      return;
    }
    this.subs.push(
      this.newPersonGQL.mutate({ ...this.newPerson }).subscribe({
        next: result => this.popServ.flashPopup(result.data.newPerson ? 'Gespeichert!' : 'Fehler!', this.container),
        error: () => this.popServ.flashPopup('Query Error!', this.container),
        complete: () => {
          // for some reason the nativeElement is undefined but the properties are on the base object
          (this.newPersonInputRef as any).value = '';
          this.newPerson.name = '';
          this.personsGQL.watch().refetch();
        }
      })
    );
  }
}
