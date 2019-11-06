import { Component, OnInit, Input } from '@angular/core';
import { of } from 'rxjs';

import { Article } from 'src/app/interfaces';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  @Input()
  public article: Article;

  constructor() {}

  ngOnInit() {
    // request the first image from the database
    // this.http.get<{ image: string, description: string, tags: string[], _id: string }[]>(`/api/image?id=${this.article.images[0]}`)
    //   .subscribe({
    //     next: (image) => {
    //       this.src = image[0].image;
    //     },
    //     error: (err) => {
    //       console.log(err);
    //     }
    //   });
  }
}
