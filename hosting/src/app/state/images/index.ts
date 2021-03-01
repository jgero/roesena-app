import { ImageEditorEffects } from './effects/imageEditor.effects';
import { ImageMultiEffects } from './effects/imageMulti.effects';
import { ImageSingleEffects } from './effects/imageSingle.effects';
import { ImageUtilsEffects } from './effects/imageUtils.effects';

export * from './actions/image.actions';

export const ImageEffects = [ImageEditorEffects, ImageMultiEffects, ImageSingleEffects, ImageUtilsEffects];

export * from './reducers/image.reducer';

export * from './selectors/image.selectors';
