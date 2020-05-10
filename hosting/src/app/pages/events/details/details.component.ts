import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AppEvent } from 'src/app/utils/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { Details } from 'src/app/utils/ui-abstractions';
import { Subscription } from 'rxjs';
import { PersonDalService } from 'src/app/services/DAL/person-dal.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent extends Details implements OnDestroy {
  event: AppEvent;
  private seenChangesSub: Subscription;

  constructor(route: ActivatedRoute, public auth: AuthService, public router: Router, personDAO: PersonDalService) {
    super(auth);
    this.event = route.snapshot.data.event;
    const part = this.event.participants.find((el) => el.id === this.auth.$user.getValue().id);
    if (part && part.hasUnseenChanges) {
      this.seenChangesSub = personDAO.markEventAsSeen(this.event.id).subscribe();
    }
  }

  ngOnDestroy() {
    if (this.seenChangesSub) {
      this.seenChangesSub.unsubscribe();
    }
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
