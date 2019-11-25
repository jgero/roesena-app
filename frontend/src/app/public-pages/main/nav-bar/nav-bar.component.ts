import { Component, ViewChild, ElementRef } from '@angular/core';

import { AuthGuard } from '../../../shared/services/auth.guard';
import { GlobalSearchService } from '../global-search.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  @ViewChild('search', { static: false })
  inputRef: ElementRef;

  constructor(public auth: AuthGuard, private search: GlobalSearchService) {}
  doSearch(searchString: string) {
    this.search.searchString.next(searchString);
  }

  reset() {
    (this.inputRef.nativeElement as HTMLInputElement).value = '';
    this.doSearch('');
  }
}
