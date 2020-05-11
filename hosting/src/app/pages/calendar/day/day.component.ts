import { Component, Input, ElementRef, HostBinding } from '@angular/core';

import { AppEvent } from 'src/app/utils/interfaces';
import { expandCollapseAnimation } from 'src/app/utils/animations';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-day',
  animations: [expandCollapseAnimation],
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
})
export class DayComponent {
  @Input()
  day: number;
  @Input('events')
  set _events(ev: AppEvent[]) {
    this.events = ev;
    const user = this.auth.$user.getValue();
    this.eventTableData = this.events.map((ev) => {
      const res = { name: ev.title, status: 'öffentlich', id: ev.id, hasUnseenChanges: false };
      if (ev.participants.length > 0) {
        const p = ev.participants.find((part) => part.id === user.id);
        if (p.hasUnseenChanges) {
          res.hasUnseenChanges = true;
        }
        switch (p.amount) {
          case -1:
            res.status = 'Rückmeldung ausstehend';
            break;
          case 0:
            res.status = 'abgelehnt';
            break;
          default:
            res.status = `angenommen mit ${p.amount} Personen`;
            break;
        }
      }
      return res;
    });
  }
  events: AppEvent[] = [];
  isPopupVisible = false;

  @HostBinding('class.inactive') get isInactive(): boolean {
    return !this.events || this.events.length === 0;
  }

  displayedColumns = ['name', 'status'];
  eventTableData: { name: string; status: string; id: string; hasUnseenChanges: boolean }[] = [];

  get params(): any {
    if (!this.calendarCardRef.nativeElement || !document.getElementById('calendar')) {
      return {};
    }
    return {
      height: this.calendarCardRef.nativeElement.clientHeight - 12 + 'px',
      width: this.calendarCardRef.nativeElement.clientWidth - 12 + 'px',
      top:
        (window.pageYOffset || document.documentElement.scrollLeft) +
        this.calendarCardRef.nativeElement.getBoundingClientRect().top +
        'px',
      left:
        (window.pageXOffset || document.documentElement.scrollLeft) +
        this.calendarCardRef.nativeElement.getBoundingClientRect().left +
        'px',
      calendarLeft:
        (window.pageXOffset || document.documentElement.scrollLeft) +
        document.getElementById('calendar').getBoundingClientRect().left +
        'px',
      calendarTop:
        (window.pageXOffset || document.documentElement.scrollLeft) +
        document.getElementById('calendar').getBoundingClientRect().top +
        'px',
      calendarWidth: document.getElementById('calendar').clientWidth + 'px',
      calendarHeight: document.getElementById('calendar').clientHeight + 'px',
    };
  }

  constructor(private calendarCardRef: ElementRef<HTMLElement>, public auth: AuthService) {}

  onCardClick() {
    if (!this.isPopupVisible) {
      this.isPopupVisible = true;
    }
  }

  onClose(ev: MouseEvent) {
    this.isPopupVisible = false;
    ev.stopPropagation();
  }
}
