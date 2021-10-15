import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { ContactMailData } from '@utils/interfaces/contact-mail-data';
import { tap, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private snackbar: MatSnackBar, private fns: AngularFireFunctions, private analytics: AngularFireAnalytics) {}

  public sendContactMail(data: ContactMailData) {
    return this.fns
      .httpsCallable('sendContactMail')(data)
      .pipe(
        tap(() => this.snackbar.open('Kontakt E-Mail wurde versendet')),
        catchError((error) => {
          this.snackbar.open('E-Mail konnte nicht gesendet werden');
          this.analytics.logEvent('exception', { fatal: false, description: error });
          return EMPTY;
        })
      );
  }
}
