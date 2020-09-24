import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ToLocalDateStringPipe } from '@shared/converters/to-local-date/to-local-date-string.pipe';
import { ToLocalTimeStringPipe } from '@shared/converters/to-local-time/to-local-time-string.pipe';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  date: Date;
  @Input()
  owner: string;
  @Input()
  subtitle: string;
  @Input()
  matIcon: string;

  get subtitleString(): string {
    if (this.date && this.owner) {
      return (
        new ToLocalDateStringPipe().transform(this.date) +
        ' ' +
        new ToLocalTimeStringPipe().transform(this.date) +
        ' - ' +
        this.owner
      );
    } else if (this.subtitle) {
      return this.subtitle;
    } else {
      return '';
    }
  }

  constructor() {}

  ngOnInit(): void {}
}
