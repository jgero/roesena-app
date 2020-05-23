import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '@state/cards/reducers/card.reducer';
import { TagClick } from '@state/cards/actions/card.actions';
import { UrlLoaderService } from '@services/url-loader.service';
import { AppImage } from '@utils/interfaces';

@Component({
  selector: 'app-image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.scss'],
})
export class ImageCardComponent implements OnInit {
  @Input()
  data: AppImage;

  $src: Observable<string | null>;
  canEdit$ = this.store.select('user').pipe(map((state) => state.isAuthor || state.isAdmin));

  constructor(private store: Store<State>, private urlLoader: UrlLoaderService) {}

  onTagClick(tag: string) {
    this.store.dispatch(new TagClick({ tag }));
  }

  ngOnInit(): void {
    this.$src = this.urlLoader.getImageURL(this.data.id);
  }
}
