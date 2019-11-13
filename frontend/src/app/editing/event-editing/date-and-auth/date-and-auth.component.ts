import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-date-and-auth',
  templateUrl: './date-and-auth.component.html',
  styleUrls: ['./date-and-auth.component.scss']
})
export class DateAndAuthComponent {
  @Input()
  set startDate(val: number) {
    if (val) {
      this.start = this.toDateString(val);
    } else {
      this.start = '';
    }
  }
  start: string = '';
  @Output()
  startDateChange = new EventEmitter<number>();
  @ViewChild('startEl', { static: true })
  private startEl: ElementRef;

  @Input()
  set endDate(val: number) {
    if (val) {
      this.end = this.toDateString(val);
    } else {
      this.start = '';
    }
  }
  end: string = '';
  @Output()
  endDateChange = new EventEmitter<number>();
  @ViewChild('endEl', { static: true })
  private endtEl: ElementRef;

  @Input()
  auth: number = 1;
  @Output()
  authChange = new EventEmitter<number>();

  newStart(val: string) {
    // if input is not valid do not update
    if (!(this.startEl.nativeElement as HTMLInputElement).checkValidity()) {
      return;
    }
    // toDateNumber returns 0 when date is not plausible
    const newDate = this.toDateNumber(val);
    if (newDate !== 0) {
      console.log(newDate);
      this.startDateChange.emit(newDate);
    }
  }

  newEnd(val: string) {
    // if input is not valid do not update
    if (!(this.endtEl.nativeElement as HTMLInputElement).checkValidity()) {
      return;
    }
    // toDateNumber returns 0 when date is not plausible
    const newDate = this.toDateNumber(val);
    if (newDate !== 0) {
      this.endDateChange.emit(newDate);
    }
  }

  updateAuth(val: number) {
    this.authChange.emit(val);
  }

  private toDateString(dateNumber: number): string {
    const year = dateNumber.toString().substr(0, 4);
    const month = dateNumber.toString().substr(4, 2);
    const day = dateNumber.toString().substr(6, 2);
    return `${day}.${month}.${year}`;
  }

  private toDateNumber(dateString: string): number {
    const parts = dateString.split('.');
    const year = parseInt(parts[2]);
    const month = parseInt(parts[1]);
    const day = parseInt(parts[0]);
    if (year > 1500 && month > 0 && month < 13 && day > 0 && day < 32) {
      const m = month > 9 ? month : '0' + month;
      const d = day > 9 ? day : '0' + day;
      return parseInt(`${year}${m}${d}`, 10);
    } else {
      return 0;
    }
  }
}
