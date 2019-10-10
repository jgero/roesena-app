import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-event-editing',
  templateUrl: './event-editing.component.html',
  styleUrls: ['./event-editing.component.scss']
})
export class EventEditingComponent implements OnInit {

  public events: Observable<Event[]>;
  public persons: Observable<{ name: string, authorityLevel: number, _id: string }[]>;

  public selectedEvent: Event;

  constructor(private http: HttpClient) {
    this.events = this.http.get<{
      _id: string,
      title: string,
      description: string,
      startDate: number,
      endDate: number,
      participants: string[]
    }[]>('/api/event?id=*');
    this.persons = this.http.get<{ name: string, authorityLevel: number, _id: string }[]>('/api/person?id=*');
  }

  ngOnInit() {
  }

  public toggleID(id: string) {
    if (!this.selectedEvent.participants) {
      // if no array exist create one with the id
      this.selectedEvent.participants = [id];
    } else if (this.selectedEvent.participants.includes(id)) {
      // if its already in the array remove it
      this.selectedEvent.participants.splice(this.selectedEvent.participants.findIndex(el => el === id), 1);
    } else {
      // else add it
      this.selectedEvent.participants.push(id);
    }
  }

  public saveEvent(event: Event) {
    console.log(event);
    const id = event._id;
    delete event._id;
    this.http.put(`/api/event?id=${id}`, event).subscribe({
      next: () => console.log('saved!')
    });
  }

}

interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: number;
  endDate: number;
  participants: string[];
}
