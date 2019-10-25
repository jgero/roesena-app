import { Component, ViewContainerRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { PopupService } from 'src/app/popup/popup.service';
import { AuthGuard } from 'src/app/shared/services/auth.guard';
import { PersonsGQL } from 'src/app/GraphQL/query-services/all-persons-gql.service';
import { ChangePwGQL } from 'src/app/GraphQL/mutation-services/changePw-gql.service';
import { UpdatePersonGQL } from 'src/app/GraphQL/mutation-services/updatePerson-gql.service';
import { NewPersonGQL } from 'src/app/GraphQL/mutation-services/newPerson-gql.service';
import { DeletePersonGQL } from 'src/app/GraphQL/mutation-services/deletePerson-gql.service';

@Component({
  selector: 'app-person-editing',
  templateUrl: './person-editing.component.html',
  styleUrls: ['./person-editing.component.scss']
})
export class PersonEditingComponent implements OnDestroy {

  private subs: Subscription[] = [];

  public persons: Observable<{ name: string, _id: string, authorityLevel: number }[]>;

  @ViewChild('box', { static: true })
  inputBox: ElementRef;

  constructor(
    private popServ: PopupService,
    private container: ViewContainerRef,
    private authGuard: AuthGuard,
    private personsGQL: PersonsGQL,
    private changePwGQL: ChangePwGQL,
    private updatePersonGQL: UpdatePersonGQL,
    private newPerson: NewPersonGQL,
    private deletePerson: DeletePersonGQL
  ) {
    this.getPersons();
  }

  private getPersons() {
    this.persons = this.personsGQL.watch().valueChanges
      .pipe(
        // filter out current user for safety
        map(result => result.data.persons.filter(el => el._id !== this.authGuard.user.getValue()._id)),
        catchError(() => {
          this.popServ.flashPopup('Could not load Persons', this.container);
          return [];
        })
      );
  }

  public onDelete(id: string) {
    this.subs.push(this.deletePerson.mutate({ _id: id }).subscribe({
      next: result => this.popServ.flashPopup(result.data.deletePerson ? 'Gelöscht!' : 'Fehler!', this.container),
      error: () => this.popServ.flashPopup('Query Error!', this.container),
      complete: () => this.getPersons()
    }));
  }

  public onEnter(name: string) {
    if (!name || name === '') {
      return;
    }
    this.subs.push(this.newPerson.mutate({ name, authorityLevel: 1 }).subscribe({
      next: result => this.popServ.flashPopup(result.data.newPerson ? 'Gespeichert!' : 'Fehler!', this.container),
      error: () => this.popServ.flashPopup('Query Error!', this.container),
      complete: () => this.getPersons()
    }));
  }

  public onReset(id: string) {
    this.subs.push(this.changePwGQL.mutate({ _id: id, newPassword: '12345' }).subscribe({
      next: result => this.popServ.flashPopup(result.data.changePw ? 'Passwort zurückgesetzt!' : 'Fehler!', this.container),
      error: () => this.popServ.flashPopup('Query error!', this.container),
      complete: () => this.getPersons()
    }));
  }

  public onSave({ _id, name, authorityLevel }: { _id: string, name: string, authorityLevel: string }) {
    if ((!name || name === '') || (!authorityLevel || authorityLevel === '')) {
      this.popServ.flashPopup('Alles ausfüllen!', this.container);
      return;
    }
    this.subs.push(this.updatePersonGQL.mutate({ _id, name, authorityLevel: parseInt(authorityLevel, 10) }).subscribe({
      next: result => this.popServ.flashPopup(result.data.updatePerson ? 'Gespeichert!' : 'Fehler!', this.container),
      error: () => this.popServ.flashPopup('Query error!', this.container),
      complete: () => this.getPersons()
    }));
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
