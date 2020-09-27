import { Component, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CookieService } from 'ngx-cookie-service';

interface TableData {
  name: string;
  expiration: string;
  description: string;
}

@Component({
  selector: 'app-cookie-manager',
  templateUrl: './cookie-manager.component.html',
  styleUrls: ['./cookie-manager.component.scss'],
})
export class CookieManagerComponent implements OnInit {
  essentialBox = true;
  analyticsBox = false;
  comfortBox = false;
  displayedColumns: string[] = ['name', 'expiration', 'description'];
  tabIndex = 0;
  get dataSource(): TableData[] {
    switch (this.tabIndex) {
      case 0:
        return [
          {
            name: 'consent',
            expiration: '1 Monat',
            description: 'Dieses Coookie wird verwendet um zu speichern welche Cookies der Besucher erlaubt hat.',
          },
        ];
      case 1:
        return [
          {
            name: '_ga',
            expiration: '2 Jahre',
            description: `Dieses Cookie wird in Verbindung mit Google Analytics
             benötigt. Es dient zur Unterscheidung von verschiedenen Benutzern durch Zuweisung von zufällig generierten
              Nummern als Identifikation. Es ist in jeder Seiten-Anfrage enthalten und wird verwendet um Aktionen die ausgeführt
               werden für die Analyse-Reports zusammenzustellen.`,
          },
          {
            name: '_ga_[id]',
            expiration: '2 Jahre',
            description: `Dieses Cookies wird ebenfalls von Google Analytics gesetzt. Es wird vom gtag.js und analytics.js Skript
            verwendet und wird laut Google ebenfalls zur Unterscheidung von Nutzern verwendet.`,
          },
        ];
      case 2:
        return [{ name: '??', expiration: '???', description: 'Momentan noch in Bearbeitung' }];
    }
  }

  constructor(private sheetRef: MatBottomSheet, private analytics: AngularFireAnalytics, private cookies: CookieService) {}

  ngOnInit(): void {}

  onClose() {
    this.sheetRef.dismiss();
  }

  onAcceptSelection() {
    this.analytics.setAnalyticsCollectionEnabled(this.analyticsBox);
    this.setCookieAndDismiss();
  }

  async onAcceptAll() {
    await this.analytics.setAnalyticsCollectionEnabled(true);
    this.setCookieAndDismiss(true);
  }

  /**
   * all values have to be set explicitly, because user could be opening the sheet
   * again to disable some things
   */
  private setCookieAndDismiss(acceptAll = false) {
    this.cookies.delete('consent', '/');
    this.sheetRef.dismiss();
    const expiresAt = new Date();
    expiresAt.setMonth(new Date().getMonth() + 1);
    if (acceptAll) {
      this.cookies.set('consent', JSON.stringify({ essential: true, analytics: true, comfort: true }), expiresAt, '/');
    } else {
      this.cookies.set(
        'consent',
        JSON.stringify({ essential: this.essentialBox, analytics: this.analyticsBox, comfort: this.comfortBox }),
        expiresAt,
        '/'
      );
    }
  }
}
