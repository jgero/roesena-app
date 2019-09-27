import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ArticleService } from './article.service';

@Component({
  selector: 'app-article-editing',
  templateUrl: './article-editing.component.html',
  styleUrls: ['./article-editing.component.scss']
})
export class ArticleEditingComponent implements OnInit {

  constructor(private http: HttpClient, public artServ: ArticleService) { }

  public title: string;
  public content: string;

  ngOnInit() { }

  public selectArticle(article?: { _id: string, date: number, title: string, content: string, images: string[] }) {
    if (article) {
      // update observable in the service
      this.artServ.selectedArticle.next(article);
      // save title and description to bind them to the input elements
      this.title = article.title;
      this.content = article.content;
    } else {
      this.artServ.selectedArticle.next({
        _id: undefined,
        title: '',
        content: '',
        images: [],
        date: 0
      });
      this.title = '';
      this.content = '';
    }
  }

  public saveArticle() {
    const updated = this.artServ.selectedArticle.getValue();
    updated.content = this.content;
    updated.title = this.title;
    this.artServ.selectedArticle.next(updated);
    this.artServ.saveSelected();
  }
}

