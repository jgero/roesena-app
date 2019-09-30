import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit, OnDestroy {

  @Input()
  private id: string;

  @Input()
  private dynamicId: Observable<string>;
  private sub: Subscription;

  public src = new BehaviorSubject<string>(undefined);

  constructor(private imgService: ImageService) { }

  ngOnInit() {
    if (this.id) {
      this.imgService.getImage(this.id)
        .subscribe({
          next: (image) => this.src.next(image.image),
          error: () => this.src.next('assets/svg/RöSeNa.svg')
        });
    } else if (this.dynamicId) {
      this.sub = this.dynamicId.subscribe({
        next: (id) => {
          this.src.next(undefined);
          this.imgService.getImage(id).subscribe({
            next: (image) => this.src.next(image.image),
            error: () => this.src.next('assets/svg/RöSeNa.svg')
          });
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
