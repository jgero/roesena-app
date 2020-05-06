import { Component, Input } from '@angular/core';
import { AppImage } from 'src/app/utils/interfaces';

@Component({ selector: 'app-image-card', template: '' })
export class ImageCardStubComponent {
  @Input() image: AppImage;
}
