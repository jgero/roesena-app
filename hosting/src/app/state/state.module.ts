import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { NgrxRouterStoreModule } from './router/ngrx-router.module';

import * as fromSearch from './searching/reducers/search.reducer';
import { SearchEffects } from './searching/effects/search.effects';

export interface State {
  router: { state: { url: string } };
  search: fromSearch.State;
}

@NgModule({
  imports: [
    StoreModule.forRoot({ search: fromSearch.reducer }),
    NgrxRouterStoreModule,
    EffectsModule.forRoot([SearchEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  exports: [],
})
export class StateModule {}
