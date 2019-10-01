import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event-editing',
  templateUrl: './event-editing.component.html',
  styleUrls: ['./event-editing.component.scss']
})
export class EventEditingComponent implements OnInit {

  public events: { _id: string, title: string, description: string, startDate: number, endDate: number, participants: string[] }[] = [];

  constructor(private http: HttpClient) {
    this.http.get<{
      _id: string,
      title: string,
      description: string,
      startDate: number,
      endDate: number,
      participants: string[]
    }[]>('/api/event?id=*').subscribe({
      next: (events) => this.events = events
    });
  }

  ngOnInit() {
  }

}
