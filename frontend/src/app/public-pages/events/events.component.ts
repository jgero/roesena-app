import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Event } from 'src/app/interfaces';
import { map } from 'rxjs/operators';
import { AuthGuard } from 'src/app/shared/services/auth.guard';
import { AcceptEventGQL } from 'src/app/GraphQL/mutation-services/event/acceptEvent-gql.service';
import { PopupService } from 'src/app/popup/popup.service';
import { EventsGQL } from 'src/app/GraphQL/query-services/events/all-events-gql.service';
import { GlobalSearchService } from '../main/global-search.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  public personalEvents: boolean;
  public searchString: string = '';
  public events: Observable<Event[]>;

  private subs: Subscription[] = [];

  constructor(
    public auth: AuthGuard,
    private eventGQL: EventsGQL,
    private acc: AcceptEventGQL,
    private container: ViewContainerRef,
    private popServ: PopupService,
    public search: GlobalSearchService
  ) {
    this.events = this.eventGQL.watch().valueChanges.pipe(map(el => el.data.events));
  }

  ngOnInit() {}

  public acceptEvent(id: string) {
    this.popServ.inputPopup('test message', this.container).then(val => {
      if (val !== '') {
        const amount = parseInt(val);
        console.log(amount);
        if (Number.isNaN(amount)) {
          this.popServ.flashPopup('Keine Zahl eingegeben', this.container);
          return;
        }
        this.subs.push(
          this.acc.mutate({ _id: id, amount }).subscribe({
            next: result => {
              if (result.data.acceptEvent) {
                this.popServ.flashPopup('Gespeichert', this.container);
                this.eventGQL.watch().refetch();
              } else {
                this.popServ.flashPopup('Fehler', this.container);
              }
            },
            error: () => this.popServ.flashPopup('Query Error!', this.container)
          })
        );
      }
    });
  }

  isMe(id: string): boolean {
    if (this.auth.user.getValue()) {
      if (this.auth.user.getValue()._id === id) {
        return true;
      }
    }
    return false;
  }
}
