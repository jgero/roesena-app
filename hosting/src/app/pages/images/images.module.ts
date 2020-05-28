import { NgModule } from '@angular/core';

import { ImagesRoutingModule } from './images-routing.module';
import { StoreModule } from '@ngrx/store';
import * as fromImage from '../../state/images/reducers/image.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ImageEffects } from '../../state/images/effects/image.effects';

@NgModule({
  declarations: [],
  imports: [ImagesRoutingModule, StoreModule.forFeature(fromImage.imageFeatureKey, fromImage.reducer), EffectsModule.forFeature([ImageEffects])],
})
export class ImagesModule {}
