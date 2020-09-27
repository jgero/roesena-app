import { Component, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-data-protection',
  templateUrl: './data-protection.component.html',
  styleUrls: ['./data-protection.component.scss'],
})
export class DataProtectionComponent implements OnInit {
  constructor(private analytics: AngularFireAnalytics, titleService: Title) {
    titleService.setTitle('RöSeNa - Datenschutzerklärung');
  }

  ngOnInit(): void {}

  async onDeactivateAnalytics() {
    await this.analytics.setAnalyticsCollectionEnabled(false);
  }
}
