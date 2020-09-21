import { Component, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-data-protection',
  templateUrl: './data-protection.component.html',
  styleUrls: ['./data-protection.component.scss'],
})
export class DataProtectionComponent implements OnInit {
  constructor(private analytics: AngularFireAnalytics) {}

  ngOnInit(): void {}

  async onDeactivateAnalytics() {
    await this.analytics.setAnalyticsCollectionEnabled(false);
  }
}
