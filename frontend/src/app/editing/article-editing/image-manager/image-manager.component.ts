import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-image-manager',
  templateUrl: './image-manager.component.html',
  styleUrls: ['./image-manager.component.scss']
})
export class ImageManagerComponent implements OnInit {

  // all existing images
  public images = new BehaviorSubject<{ image: string, description: string, tags: string[], _id: string }[]>([]);

  constructor(private http: HttpClient, public artServ: ArticleService) {
    this.http.get<{ image: string, description: string, tags: string[], _id: string }[]>('/api/image?id=*').subscribe({
      next: (images) => this.images.next(images)
    });
  }

  ngOnInit() { }

  public onSelect(index: number) {
    const newSelection = this.artServ.selectedArticle.getValue();
    // look if id of the clicked image is already in the selection
    const imgIndex = newSelection.images.findIndex(imgID => imgID === this.images.getValue()[index]._id);
    if (imgIndex < 0) {
      // id is not already in the selection -> add it
      newSelection.images.push(this.images.getValue()[index]._id);
    } else {
      // id is already in the selection -> remove it
      newSelection.images.splice(imgIndex, 1);
    }
    this.artServ.selectedArticle.next(newSelection);
  }
}
