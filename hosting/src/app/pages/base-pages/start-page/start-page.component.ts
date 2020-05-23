import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { AppEvent, AppArticle } from '@utils/interfaces';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
})
export class StartPageComponent {
  public eventCards: Observable<AppEvent[]>;
  public articleCards: Observable<AppArticle[]>;

  constructor() {
    // this.eventCards = eventDAO.getAll(3);
    // this.articleCards = articleDAO.getAll(3);
  }
}
