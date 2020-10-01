import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-usage-hint-popup',
  templateUrl: './usage-hint-popup.component.html',
  styleUrls: ['./usage-hint-popup.component.scss'],
})
export class UsageHintPopupComponent implements OnInit {
  accepted = false;
  save = false;

  constructor(private cookies: CookieService) {}

  ngOnInit(): void {}

  saveInCookie() {
    // if comfort cookies are allowed set a new cookie to not show message again if box is checked
    if (this.cookies.check('consent') && JSON.parse(this.cookies.get('consent')).comfort === true && this.save) {
      this.cookies.delete('UsageAgreementAccepted', '/');
      const expiresAt = new Date();
      expiresAt.setMonth(new Date().getMonth() + 3);
      this.cookies.set('UsageAgreementAccepted', JSON.stringify({ accepted: true }), expiresAt, '/');
    }
  }
}
