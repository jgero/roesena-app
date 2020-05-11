import { Component, Input } from '@angular/core';

import { AppEvent } from '../../../utils/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { Card } from 'src/app/utils/ui-abstractions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent extends Card {
  @Input()
  public data: AppEvent;

  get unseen(): number | null {
    const user = this.auth.$user.getValue();
    if (!this.data) { return null; }
    const part = this.data.participants.find((p) => p.id === user.id);
    if (!part) { return null; }
    return part.hasUnseenChanges ? 1 : null;
  }

  get status(): string {
    const user = this.auth.$user.getValue();
    if (!user || !this.data) { return ''; }
    const part = this.data.participants.find((p) => p.id === user.id);
    if (!part) { return ''; }
    switch (part.amount) {
      case -1:
        return 'Rückmeldung ausstehend';
      case 0:
        return 'abgelehnt';
      default:
        return 'angemeldet';
    }
  }

  constructor(auth: AuthService, router: Router) {
    super(auth, router, 'events');
  }
}
