import { Component, OnInit, Input } from '@angular/core';

import { Event } from 'src/app/interfaces';

@Component({
  selector: 'app-day-details',
  templateUrl: './day-details.component.html',
  styleUrls: ['./day-details.component.scss']
})
export class DayDetailsComponent implements OnInit {

  @Input()
  public day: Event[];

  constructor() { }

  ngOnInit() {
  }

}
