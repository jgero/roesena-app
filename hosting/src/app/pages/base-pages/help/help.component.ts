import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AppArticle } from 'src/app/utils/interfaces';
import { ArticleDalService } from 'src/app/services/DAL/article-dal.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent {
  $textData: Observable<AppArticle>;
  constructor(articleDAO: ArticleDalService) {
    this.$textData = articleDAO.getBySearchStrings(['Hilfe'], 1).pipe(map((val) => val[0]));
  }
}
