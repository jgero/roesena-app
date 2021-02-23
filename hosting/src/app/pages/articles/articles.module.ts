import { NgModule } from '@angular/core';

import { ArticlesRoutingModule } from './articles-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromArticle from '@state/articles/reducers/article.reducer';
import { ArticleSingleEffects } from '@state/articles/effects/articleSingle.effects';
import { ArticleMultiEffects } from '@state/articles/effects/articleMulti.effects';
import { ArticleEditorEffects } from '@state/articles/effects/articleEditor.effects';

@NgModule({
  declarations: [],
  imports: [
    ArticlesRoutingModule,
    StoreModule.forFeature(fromArticle.articleFeatureKey, fromArticle.reducer),
    EffectsModule.forFeature([ArticleSingleEffects, ArticleMultiEffects, ArticleEditorEffects]),
  ],
})
export class ArticlesModule {}
