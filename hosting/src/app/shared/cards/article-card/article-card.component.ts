import { Component, Input } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { Card } from 'src/app/utils/ui-abstractions';
import { Router } from '@angular/router';
import { AppArticle } from 'src/app/utils/interfaces';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
})
export class ArticleCardComponent extends Card {
  @Input()
  data: AppArticle;

  constructor(auth: AuthService, router: Router) {
    super(auth, router, 'articles');
  }
}
