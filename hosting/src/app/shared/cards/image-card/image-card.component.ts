import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { UrlLoaderService } from '@services/url-loader.service';
import { AppImage } from '@utils/interfaces';
import { State } from '@state/state.module';
import { AddSearchString } from '@state/searching/actions/search.actions';

@Component({
  selector: 'app-image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.scss'],
})
export class ImageCardComponent implements OnInit {
  @Input()
  data: AppImage;

  $src: Observable<string | null>;
  canEdit$ = this.store
    .select('user', 'user')
    .pipe(map((user) => user && (user.groups.includes('admin') || (this.data && this.data.id === user.id))));

  constructor(private store: Store<State>, private urlLoader: UrlLoaderService) {}

  onTagClick(tag: string) {
    this.store.dispatch(new AddSearchString({ searchString: tag }));
  }

  ngOnInit(): void {
    this.$src = this.urlLoader.getImageURL(this.data.id);
  }
}
