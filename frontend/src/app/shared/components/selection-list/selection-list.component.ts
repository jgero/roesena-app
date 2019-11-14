import { Component, OnInit, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EventsGQL } from 'src/app/GraphQL/query-services/events/all-events-gql.service';
import { map, catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-selection-list',
  templateUrl: './selection-list.component.html',
  styleUrls: ['./selection-list.component.scss']
})
export class SelectionListComponent implements OnInit {
  @Input()
  list: Observable<{ _id: string; value: string }[]>;
  public activeId: string = null;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.activeId = this.route.snapshot.paramMap.get('id');
  }

  select(id: string | null) {
    this.activeId = id;
    const mode = this.router.url.split('/')[2];
    if (id) {
      this.router.navigate(['edit', mode, id]);
    } else {
      this.router.navigate(['edit', mode]);
    }
  }
}
