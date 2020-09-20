import { Component, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-cookie-manager',
  templateUrl: './cookie-manager.component.html',
  styleUrls: ['./cookie-manager.component.scss'],
})
/**
 * all values have to be set explicitly, because user could be opening the sheet
 * again to disable some things
 */
export class CookieManagerComponent implements OnInit {
  essentialBox = true;
  analyticsBox = false;

  constructor(private sheetRef: MatBottomSheet, private analytics: AngularFireAnalytics) {
    console.log(document.cookie);
  }

  ngOnInit(): void {}

  onAcceptSelection() {
    this.sheetRef.dismiss();
    this.analytics.setAnalyticsCollectionEnabled(this.analyticsBox);
  }

  onAcceptAll() {
    this.sheetRef.dismiss();
    this.analytics.setAnalyticsCollectionEnabled(true);
  }
}
