import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  @Input()
  public article: { title: string, content: string, _id: string, images: string[] };

  // public src: string;

  constructor(private http: HttpClient) {
  }

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
