import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AppEvent } from 'src/app/utils/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { Details } from 'src/app/utils/ui-abstractions';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent extends Details {
  event: AppEvent;

  constructor(route: ActivatedRoute, public auth: AuthService, public router: Router) {
    super(auth);
    this.event = route.snapshot.data.event;
  }

  onParticipantClick(id: string) {
    if (id === this.auth.$user.getValue().id) {
      this.router.navigate(['auth', 'my-events']);
    }
  }

  get amountAccumulated(): number {
    let amount = 0;
    this.event.participants.forEach((part) => {
      if (part.amount < 0) {
        return;
      }
      amount += part.amount;
    });
    return amount;
  }

  get pendingPercent(): number {
    let pending = 0;
    this.event.participants.forEach((part) => {
      if (part.amount >= 0) {
        return;
      }
      pending++;
    });
    return Math.floor((pending / this.event.participants.length) * 100);
  }

  get pendingAmount(): number {
    let counter = 0;
    this.event.participants.forEach((part) => {
      if (part.amount >= 0) {
        return;
      }
      counter++;
    });
    return counter;
  }
}
