import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-day-details',
  templateUrl: './day-details.component.html',
  styleUrls: ['./day-details.component.scss']
})
export class DayDetailsComponent implements OnInit {

  @Input()
  public day: any;

  constructor() { }

  ngOnInit() {
  }

}
