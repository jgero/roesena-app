import { Component, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-data-protection',
  templateUrl: './data-protection.component.html',
  styleUrls: ['./data-protection.component.scss'],
})
export class DataProtectionComponent implements OnInit {
  constructor(private analytics: AngularFireAnalytics, seo: SeoService) {
    seo.setTags(
      'Datenschutzerklärung',
      'Die genaue Ausarbeitung der Erhebung und Verarbeitung von Daten auf der Webseite',
      undefined,
      '/data-protection'
    );
  }

  ngOnInit(): void {}

  async onDeactivateAnalytics() {
    await this.analytics.setAnalyticsCollectionEnabled(false);
  }
}
