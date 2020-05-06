import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { AppImage } from 'src/app/utils/interfaces';
import { ImageDalService } from 'src/app/services/DAL/image-dal.service';
import { AuthService } from 'src/app/services/auth.service';
import { Card } from 'src/app/utils/ui-abstractions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.scss'],
})
export class ImageCardComponent extends Card implements OnInit {
  @Input()
  data: AppImage;
  $src: Observable<string | null>;

  constructor(private imageDAO: ImageDalService, auth: AuthService, router: Router) {
    super(auth, router, 'images');
  }

  ngOnInit(): void {
    this.$src = this.imageDAO.getDownloadURL(this.data.id);
  }
}
