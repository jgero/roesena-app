import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SendContactMail } from '@state/contact/actions/contact.actions';
import { State } from '@state/contact/reducers/contact.reducer';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  animations: [
    trigger('checkboxExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ContactComponent implements OnInit {
  isLoading$ = this.store.select('contact', 'isLoading');
  contactForm = new FormGroup({
    subject: new FormControl('Problem mit der Webseite', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    comment: new FormControl('', [Validators.required, Validators.maxLength(1000), Validators.minLength(1), Validators.pattern('^[a-zA-Z@äöüÄÖÜ .-]+$')]),
  });

  problemCheckboxes = [
    { text: 'Login/Registrierung funktioniert nicht', checked: false },
    { text: 'Mein Account wird nicht freigeschaltet', checked: false },
    { text: 'Rückmeldung funktioniert nicht', checked: false },
    { text: 'Layout sieht verschoben aus', checked: false },
    { text: 'Text ist abgeschnitten', checked: false },
    { text: 'tritt auf einem Mobilgerät auf', checked: false },
    { text: 'tritt am PC auf', checked: false },
  ];

  constructor(private store: Store<State>) {}

  ngOnInit(): void {}

  onSend() {
    this.store.dispatch(
      new SendContactMail({
        comment: this.contactForm.get('comment').value,
        formData:
          this.contactForm.get('subject').value === 'Problem mit der Webseite'
            ? this.problemCheckboxes.filter((el) => el.checked).map((el) => ({ text: el.text }))
            : [],
        replyTo: this.contactForm.get('email').value,
        subject: this.contactForm.get('subject').value,
      })
    );
  }
}
