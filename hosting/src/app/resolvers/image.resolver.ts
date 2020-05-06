import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, take } from 'rxjs/operators';

import { AppImage } from '../utils/interfaces';
import { ImageDalService } from '../services/DAL/image-dal.service';

@Injectable({ providedIn: 'root' })
export class ImageResolver implements Resolve<AppImage> {
  constructor(private DAO: ImageDalService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AppImage> | Promise<AppImage> | AppImage {
    const id = route.paramMap.get('id');
    return this.DAO.getById(id).pipe(
      take(1),
      tap((image) => {
        if (!image) {
          this.router.navigate(['images', 'overview']);
        }
      })
    );
  }
}
