import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrls: ['./startpage.component.scss']
})
export class StartpageComponent implements OnInit {

  public articles = new BehaviorSubject<{ _id: string, date: number, title: string, content: string, images: string[] }[]>([]);

  constructor(private http: HttpClient) {
    // request the articles from the database
    this.http.get<{ _id: string, date: number, title: string, content: string, images: string[] }[]>('/api/article?id=*').subscribe({
      next: (arts) => {
        this.articles.next(arts);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  ngOnInit() {
  }

}
