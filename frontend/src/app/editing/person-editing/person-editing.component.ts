import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PopupService } from 'src/app/popup/popup.service';
import { AuthGuard } from 'src/app/shared/services/auth.guard';

@Component({
  selector: 'app-person-editing',
  templateUrl: './person-editing.component.html',
  styleUrls: ['./person-editing.component.scss']
})
export class PersonEditingComponent {

  public persons: { name: string, _id: string, authorityLevel: number }[] = [];

  @ViewChild('box', { static: true })
  inputBox: ElementRef;

  constructor(private http: HttpClient, private popServ: PopupService, private container: ViewContainerRef, private authGuard: AuthGuard) {
    this.getPersons();
  }

  private getPersons() {
    this.http.get<{ name: string, authorityLevel: number, _id: string }[]>('/api/person?id=*').subscribe({
      // filter out current user for safety
      next: (persons) => this.persons = persons.filter(el => el._id !== this.authGuard.user.getValue()._id)
    });
  }

  public onDelete(id: string) {
    this.http.delete(`/api/person?id=${id}`).subscribe({
      complete: () => {
        this.popServ.flashPopup('gelöscht!', this.container);
        this.getPersons();
      },
      error: (err: HttpErrorResponse) => this.popServ.flashPopup(err.statusText, this.container)
    });
  }

  public onEnter(value: string) {
    if (this.inputBox.nativeElement.value === '') {
      return;
    }
    this.http.post('/api/person', { name: value, authorityLevel: 1 }).subscribe({
      complete: () => {
        this.inputBox.nativeElement.value = '';
        this.popServ.flashPopup('erstellt!', this.container);
        this.getPersons();
      },
      error: (err: HttpErrorResponse) => this.popServ.flashPopup(err.statusText, this.container)
    });
  }

  public onReset(id: string) {
    this.http.post('/api/changePW', { _id: id, password: '12345' }).subscribe({
      complete: () => this.popServ.flashPopup('zurückgesetzt!', this.container),
      error: (err: HttpErrorResponse) => this.popServ.flashPopup(err.statusText, this.container)
    });
  }

  public onSave(id: string) {
    const body = this.persons.find(el => el._id === id);
    delete body._id;
    this.http.put(`/api/person?id=${id}`, body).subscribe({
      complete: () => {
        this.popServ.flashPopup('gespeichert!', this.container);
        this.getPersons();
      },
      error: (err: HttpErrorResponse) => this.popServ.flashPopup(err.statusText, this.container)
    });
  }
}
