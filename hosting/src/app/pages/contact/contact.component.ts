import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SeoService } from '@services/seo.service';
import { ContactService } from '@services/contact.service';

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
export class ContactComponent {
  isLoading = false;
  contactForm = new FormGroup({
    subject: new FormControl('Problem mit der Webseite', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    comment: new FormControl('', [
      Validators.required,
      Validators.maxLength(1000),
      Validators.minLength(1),
      Validators.pattern('^[a-zA-Z@äöüÄÖÜ .-]+$'),
    ]),
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

  constructor(seo: SeoService, private contactService: ContactService, private zone: NgZone) {
    seo.setTags('Kontakt', 'Seite mit einem Formular zur einfachen Kontaktaufnahme mit der RöSeNa', undefined, '/contact');
  }

  onSend() {
    this.isLoading = true;
    this.contactService
      .sendContactMail({
        comment: this.contactForm.get('comment').value,
        formData:
          this.contactForm.get('subject').value === 'Problem mit der Webseite'
            ? this.problemCheckboxes.filter((el) => el.checked).map((el) => ({ text: el.text }))
            : [],
        replyTo: this.contactForm.get('email').value,
        subject: this.contactForm.get('subject').value,
      })
      .subscribe({
        complete: () => this.cleanup(),
        error: () => this.cleanup(),
      });
  }

  cleanup() {
    this.zone.run(() => {
      this.isLoading = false;
      this.contactForm.reset();
    });
  }
}
