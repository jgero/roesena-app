import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-person-editing',
  templateUrl: './person-editing.component.html',
  styleUrls: ['./person-editing.component.scss']
})
export class PersonEditingComponent implements OnInit {

  public persons: { name: string, _id: string }[] = [];

  constructor(private http: HttpClient) {
    this.getPersons();
  }

  private getPersons() {
    this.http.get<{ name: string, _id: string }[]>('/api/person?id=*').subscribe({
      next: (persons) => this.persons = persons
    });
  }

  ngOnInit() {
  }

  public onDelete(id: string) {
    this.http.delete(`/api/person?id=${id}`).subscribe({
      complete: () => this.getPersons()
    });
  }

  public onEnter(value: string) {
    this.http.post('/api/person', { name: value }).subscribe({
      complete: () => this.getPersons()
    });
  }

  public onReset(id: string) {
    this.http.post('/api/changePW', { _id: id, password: '12345' }).subscribe({
      complete: () => console.log('passowrd reset')
    });
  }
}
