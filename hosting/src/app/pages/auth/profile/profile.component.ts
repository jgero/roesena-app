import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { BrowserService } from 'src/app/services/browser.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnDestroy {
  updateNameForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZäöüÄÖÜ -]+$')]),
  });
  private subs: Subscription[] = [];
  constructor(public auth: AuthService, private browser: BrowserService) {}

  onUpdateNameSubmit() {
    this.updateNameForm.disable();
    const user = this.auth.$user.getValue();
    user.name = this.updateNameForm.get('name').value;
    this.subs.push(
      this.auth.updateName(user).subscribe({
        next: () => {
          this.updateNameForm.reset();
          this.updateNameForm.enable();
        },
      })
    );
  }

  logout() {
    this.subs.push(
      this.auth.logout().subscribe({
        next: () => {
          this.browser.reload();
        },
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
