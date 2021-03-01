import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { NgrxRouterStoreModule } from './router/ngrx-router.module';
import { MergedRouteReducerState } from './router/merged-route';

import * as fromSearch from './searching/reducers/search.reducer';
import { SearchEffects } from './searching/effects/search.effects';

import * as fromPerson from '@state/persons';
import * as fromEvent from '@state/events';
import * as fromImage from '@state/images';
import * as fromArticle from '@state/articles';

import { GlobalEffects } from './global.effects';

export interface State {
  router: MergedRouteReducerState;
  [fromSearch.searchFeatureKey]: fromSearch.State;
  [fromPerson.personFeatureKey]: fromPerson.State;
  [fromEvent.eventFeatureKey]: fromEvent.State;
  [fromImage.imageFeatureKey]: fromImage.State;
  [fromArticle.articleFeatureKey]: fromArticle.State;
}

@NgModule({
  imports: [
    StoreModule.forRoot({
      [fromSearch.searchFeatureKey]: fromSearch.reducer,
      [fromPerson.personFeatureKey]: fromPerson.reducer,
      [fromEvent.eventFeatureKey]: fromEvent.reducer,
      [fromArticle.articleFeatureKey]: fromArticle.reducer,
      [fromImage.imageFeatureKey]: fromImage.reducer,
    }),
    NgrxRouterStoreModule,
    EffectsModule.forRoot([
      SearchEffects,
      ...fromPerson.PersonEffects,
      ...fromEvent.EventEffects,
      ...fromImage.ImageEffects,
      ...fromArticle.ArticleEffects,
      GlobalEffects,
    ]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  exports: [],
})
export class StateModule {}
