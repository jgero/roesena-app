import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Overview } from './overview';
import { DAL } from '../interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { map, tap } from 'rxjs/operators';

export abstract class SearchableOverview extends Overview {
  searchString = '';
  get searchTags(): string[] {
    if (this.searchString === '') {
      return [];
    }
    return this.searchString.split(',').map((tag) => tag.trim());
  }
  $searchTags: Observable<string[]>;

  constructor(private routeBase: string[], DAO: DAL, public route: ActivatedRoute, public router: Router, auth: AuthService) {
    super(DAO, auth);
  }

  initDataStream() {
    this.searchString = this.route.snapshot.paramMap.get('searchString') || '';
    this.updateDataStream();
    this.$searchTags = this.route.paramMap.pipe(
      map((m) => m.get('searchString') || ''),
      tap(() => this.updateDataStream()),
      map((p) => {
        if (p === '') {
          return [];
        }
        return p.split(',').map((tag) => tag.trim());
      })
    );
  }

  updateDataStream() {
    if (this.searchString) {
      this.$data = this.DAO.getBySearchStrings(this.searchTags);
    } else {
      this.$data = this.DAO.getAll();
    }
  }

  onSearchClick() {
    if (this.searchString) {
      this.router.navigate([...this.routeBase, this.searchString]);
    } else {
      this.router.navigate([...this.routeBase]);
    }
  }

  onSearchEvent(newSearchStrings: string[]) {
    this.searchString = newSearchStrings.join(',');
    this.onSearchClick();
  }

  onTagClick(tag: string) {
    if (this.searchString === '') {
      this.searchString = tag;
    } else {
      if (this.searchString.split(',').includes(tag)) {
        return;
      }
      this.searchString = this.searchString.concat(',', tag);
    }
    this.onSearchClick();
  }
}
