import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { CookieManagerComponent } from './cookie-manager/cookie-manager.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  versionNumber = environment.buildVersion;

  constructor(private cookieSheet: MatBottomSheet, cookies: CookieService) {
    // open cookie sheet when no consent cookie is set yet
    if (!cookies.check('consent')) {
      this.cookieSheet.open(CookieManagerComponent);
    }
  }

  ngOnInit(): void {}

  openCookieSettings() {
    this.cookieSheet.open(CookieManagerComponent);
  }
}
