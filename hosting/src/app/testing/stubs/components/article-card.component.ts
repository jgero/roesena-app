import { Component, Input } from '@angular/core';
import { AppArticle } from 'src/app/utils/interfaces';

@Component({ selector: 'app-article-card', template: '' })
export class ArticleCardStubComponent {
  @Input() article: AppArticle;
}
