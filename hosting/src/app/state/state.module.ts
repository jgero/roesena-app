import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { NgrxRouterStoreModule } from './router/ngrx-router.module';

import * as fromSearch from './searching/reducers/search.reducer';
import { SearchEffects } from './searching/effects/search.effects';

import * as fromUser from './user/reducers/user.reducer';
import { UserEffects } from './user/effects/user.effects';
import { MergedRouteReducerState } from './router/merged-route';
import { GlobalEffects } from './global.effects';

export interface State {
  router: MergedRouteReducerState;
  search: fromSearch.State;
  user: fromUser.State;
}

@NgModule({
  imports: [
    StoreModule.forRoot({ search: fromSearch.reducer, user: fromUser.reducer }),
    NgrxRouterStoreModule,
    EffectsModule.forRoot([SearchEffects, UserEffects, GlobalEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  exports: [],
})
export class StateModule {}
