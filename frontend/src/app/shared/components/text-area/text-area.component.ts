import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent implements OnInit {
  @Input()
  value: string = '';
  @Output()
  valueChange = new EventEmitter<string>();
  @Input()
  placeholder: string = '';

  constructor() {}

  ngOnInit() {}
}
