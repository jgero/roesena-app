import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';

import { Article } from '../../interfaces';
import { ArticlesGQL } from 'src/app/GraphQL/query-services/articles/all-articles-gql.service';
import { map, catchError } from 'rxjs/operators';
import { PopupService } from 'src/app/popup/popup.service';

@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrls: ['./startpage.component.scss']
})
export class StartpageComponent implements OnInit {
  public articles: Observable<Article[]>;

  constructor(private articlesGQL: ArticlesGQL, private popServ: PopupService, private container: ViewContainerRef) {}

  ngOnInit() {
    this.articles = this.articlesGQL.watch().valueChanges.pipe(
      // map to actual data
      map(result => result.data.articles),
      // catch error and return empty article array
      catchError(() => {
        this.popServ.flashPopup('Could not load Persons', this.container);
        return [];
      })
    );
  }
}
