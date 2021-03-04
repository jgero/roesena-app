import { NgModule } from '@angular/core';

import { ImagesRoutingModule } from './images-routing.module';
import { StoreModule } from '@ngrx/store';
import * as fromImage from '../../state/images/reducers/image.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ImageSingleEffects } from '@state/images/effects/imageSingle.effects';
import { ImageMultiEffects } from '@state/images/effects/imageMulti.effects';
import { ImageEditorEffects } from '@state/images/effects/imageEditor.effects';
import { ImageUtilsEffects } from '@state/images/effects/imageUtils.effects';

@NgModule({
  declarations: [],
  imports: [
    ImagesRoutingModule,
    StoreModule.forFeature(fromImage.imageFeatureKey, fromImage.reducer),
    EffectsModule.forFeature([ImageSingleEffects, ImageMultiEffects, ImageEditorEffects, ImageUtilsEffects]),
  ],
})
export class ImagesModule {}
