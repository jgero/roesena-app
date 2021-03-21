import { Component, Input } from '@angular/core';
import { AppImage } from 'src/app/utils/interfaces';
import { Router } from '@angular/router';

@Component({ selector: 'app-image-card', template: '' })
export class ImageCardStubComponent {
  @Input() image: AppImage;

  constructor(private router: Router) {}
}
