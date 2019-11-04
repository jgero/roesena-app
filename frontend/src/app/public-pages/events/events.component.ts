import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Event } from 'src/app/interfaces';
import { EventsGQL } from 'src/app/GraphQL/query-services/all-events-gql.service';
import { map, tap } from 'rxjs/operators';
import { AuthGuard } from 'src/app/shared/services/auth.guard';
import { AcceptEventGQL } from 'src/app/GraphQL/mutation-services/acceptEvent-gql.service';
import { PopupService } from 'src/app/popup/popup.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  public filterEvents: boolean;
  public events: Observable<any>;

  private subs: Subscription[] = [];

  constructor(
    public auth: AuthGuard,
    eventGQL: EventsGQL,
    private acc: AcceptEventGQL,
    private container: ViewContainerRef,
    private popServ: PopupService
  ) {
    this.events = eventGQL.watch().valueChanges.pipe(
      map(el => el.data.events)
    );
  }

  ngOnInit() {
  }

  public acceptEvent(id: string) {
    this.subs.push(this.acc.mutate({ _id: id, amount: 6 }).subscribe({
      next: result => this.popServ.flashPopup(result.data.acceptEvent ? 'Done!' : 'Fehler!', this.container),
      error: () => this.popServ.flashPopup('Query Error!', this.container)
    }));
  }

}
