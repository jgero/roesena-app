import * as fromImage from '../reducers/image.reducer';
import { selectImageState } from './image.selectors';

describe('Image Selectors', () => {
  it('should select the feature state', () => {
    const result = selectImageState({
      [fromImage.imageFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
