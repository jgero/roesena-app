import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  public articles = new BehaviorSubject<{ _id: string, date: number, title: string, content: string, images: string[] }[]>([]);
  public selectedArticle = new BehaviorSubject<{ _id: string, date: number, title: string, content: string, images: string[] }>({
    _id: undefined,
    title: '',
    content: '',
    images: [],
    date: 0
  });

  constructor(private http: HttpClient) {
    this.loadArticles();
  }

  private loadArticles() {
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

  public saveSelected() {
    // update date in the observable
    const updatedDate = this.selectedArticle.getValue();
    updatedDate.date = getCurrentDate();
    this.selectedArticle.next(updatedDate);
    // get the body for the request
    const body = this.selectedArticle.getValue();
    if (body._id) {
      const id = body._id;
      delete body._id;
      this.http.put(`/api/article?id=${id}`, body).subscribe({
        complete: () => this.loadArticles(),
        error: (err) => console.log(err)
      });
    } else {
      delete body._id;
      this.http.post('/api/article', body).subscribe({
        complete: () => this.loadArticles(),
        error: (err) => console.log(err)
      });
    }
  }
}

function getCurrentDate() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  return parseInt(`${year}${month > 9 ? month : '0' + month}${day > 9 ? day : '0' + day}`, 10);
}

