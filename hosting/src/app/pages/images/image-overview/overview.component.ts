import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AppImage } from 'src/app/utils/interfaces';
import { ImageDalService } from 'src/app/services/DAL/image-dal.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { cardFlyIn } from 'src/app/utils/animations';
import { PaginatedOverview } from 'src/app/utils/ui-abstractions';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations: [cardFlyIn],
})
export class OverviewComponent extends PaginatedOverview {
  $data: Observable<AppImage[]>;

  constructor(imageDAO: ImageDalService, auth: AuthService, route: ActivatedRoute, router: Router) {
    super(['images', 'overview'], imageDAO, route, router, auth);
  }
}
