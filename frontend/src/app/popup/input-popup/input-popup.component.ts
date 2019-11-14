import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input-popup',
  templateUrl: './input-popup.component.html',
  styleUrls: ['./input-popup.component.scss']
})
export class InputPopupComponent {
  @Input()
  message: string;

  @Output()
  userInput = new EventEmitter<string>();

  newInput(val: string) {
    this.userInput.emit(val);
  }
}
