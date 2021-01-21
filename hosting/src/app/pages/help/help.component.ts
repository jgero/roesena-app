import { Component, OnDestroy } from '@angular/core';
import { SubscriptionService } from '@services/subscription.service';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnDestroy {
  constructor(private subs: SubscriptionService, seo: SeoService) {
    seo.setTags('Hilfe', 'Hinweise und Hilfestellungen zur Verwendung der Webseite', undefined, '/help');
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
