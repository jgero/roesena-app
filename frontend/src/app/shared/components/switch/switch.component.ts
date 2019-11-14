import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent {
  @Input()
  toggle = false;
  @Output()
  toggleChange = new EventEmitter<boolean>();

  @Input()
  label = '';

  switch(val: boolean) {
    this.toggle = val;
    this.toggleChange.emit(this.toggle);
  }
}
