import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SubscriptionService } from '@services/subscription.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnDestroy, OnInit {
  constructor(private subs: SubscriptionService, titleService: Title) {
    titleService.setTitle('RöSeNa - Hilfe');
  }

  ngOnInit() {
    if (window.location.hash) {
      this.navigateToSection(window.location.hash);
    }
  }

  navigateToSection(section: string) {
    window.location.hash = '';
    window.location.hash = section;
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
