import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PopupService } from 'src/app/popup/popup.service';

@Component({
  selector: 'app-person-editing',
  templateUrl: './person-editing.component.html',
  styleUrls: ['./person-editing.component.scss']
})
export class PersonEditingComponent implements OnInit {

  public persons: { name: string, _id: string }[] = [];

  constructor(private http: HttpClient, private popServ: PopupService, private container: ViewContainerRef) {
    this.getPersons();
  }

  private getPersons() {
    this.http.get<{ name: string, _id: string }[]>('/api/person?id=*').subscribe({
      next: (persons) => this.persons = persons
    });
  }

  ngOnInit() { }

  public onDelete(id: string) {
    this.http.delete(`/api/person?id=${id}`).subscribe({
      complete: () => {
        this.getPersons();
        this.popServ.flashPopup('gelöscht!', this.container);
      },
      error: (err: HttpErrorResponse) => this.popServ.flashPopup(err.statusText, this.container)
    });
  }

  public onEnter(value: string) {
    this.http.post('/api/person', { name: value }).subscribe({
      complete: () => {
        this.getPersons();
        this.popServ.flashPopup('erstellt!', this.container);
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
}
