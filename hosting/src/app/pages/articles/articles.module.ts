import { NgModule } from '@angular/core';

import { ArticlesRoutingModule } from './articles-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromArticle from '@state/articles/reducers/article.reducer';
import { ArticleEffects } from '@state/articles/effects/article.effects';

@NgModule({
  declarations: [],
  imports: [
    ArticlesRoutingModule,
    StoreModule.forFeature(fromArticle.articleFeatureKey, fromArticle.reducer),
    EffectsModule.forFeature([ArticleEffects]),
  ],
})
export class ArticlesModule {}
