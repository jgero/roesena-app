import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-image-manager',
  templateUrl: './image-manager.component.html',
  styleUrls: ['./image-manager.component.scss']
})
export class ImageManagerComponent implements OnInit {

  // all existing images
  // public images = new BehaviorSubject<{ image: string, description: string, tags: string[], _id: string }[]>([]);

  // constructor(private http: HttpClient, public artServ: ArticleService) {
  //   this.http.get<{ image: string, description: string, tags: string[], _id: string }[]>('/api/image?id=*').subscribe({
  //     next: (images) => this.images.next(images)
  //   });
  // }

  ngOnInit() { }


}
