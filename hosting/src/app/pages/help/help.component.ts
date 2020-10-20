import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SubscriptionService } from '@services/subscription.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnDestroy {
  constructor(private subs: SubscriptionService, titleService: Title) {
    titleService.setTitle('RöSeNa - Hilfe');
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
