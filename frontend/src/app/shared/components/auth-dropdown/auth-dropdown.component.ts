import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-auth-dropdown',
  templateUrl: './auth-dropdown.component.html',
  styleUrls: ['./auth-dropdown.component.scss']
})
export class AuthDropdownComponent {
  public readonly AuthStrings = ['öffentlich', 'Mitglieder', 'Gruppenleiter', 'Präsidium', 'Admins'];

  @Input()
  auth: number = 1;
  @Output()
  private authChange = new EventEmitter<number>();
  isVisible: boolean = false;

  constructor() {}

  emit(val: number) {
    this.authChange.emit(val);
    this.auth = val;
    this.isVisible = false;
  }
}
