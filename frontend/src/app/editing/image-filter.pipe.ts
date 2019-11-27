import { Pipe, PipeTransform } from '@angular/core';
import { Image } from '../interfaces';

@Pipe({
  name: 'imageFilter'
})
export class ImageFilterPipe implements PipeTransform {
  transform(images: Image[], searchString: string): Image[] {
    if (images) {
      return images.filter(
        image =>
          image.description.toLowerCase().includes(searchString.toLowerCase()) ||
          !!image.tags.find(tag => tag.toLowerCase().includes(searchString.toLowerCase()))
      );
    } else {
      return [];
    }
  }
}
