import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

  @Input()
  private id: string;

  public src = new BehaviorSubject<string>(undefined);

  constructor(private imgService: ImageService) { }

  ngOnInit() {
    this.imgService.getImage(this.id)
      .subscribe({
        next: (image) => this.src.next(image.image),
        error: () => this.src.next('assets/svg/RöSeNa.svg')
      });
  }

}
