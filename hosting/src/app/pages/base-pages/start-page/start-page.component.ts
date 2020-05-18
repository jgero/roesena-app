import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { AppEvent, AppArticle } from '@utils/interfaces';
import { EventDALService } from '@services/DAL/event-dal.service';
import { ArticleDalService } from '@services/DAL/article-dal.service';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
})
export class StartPageComponent {
  public eventCards: Observable<AppEvent[]>;
  public articleCards: Observable<AppArticle[]>;

  constructor(eventDAO: EventDALService, articleDAO: ArticleDalService) {
    this.eventCards = eventDAO.getAll(3);
    this.articleCards = articleDAO.getAll(3);
  }
}
