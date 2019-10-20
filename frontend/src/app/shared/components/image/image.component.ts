import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { Image } from 'src/app/interfaces';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit, OnDestroy {

  @Input()
  private id: string;

  @Input()
  private dynamicId: Observable<string>;
  private subs: Subscription[] = [];

  public src = new BehaviorSubject<string>(undefined);

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    if (this.id) {
      this.subs.push(this.apollo.watchQuery<{ image: Image }>({
        query: gql`
        query GetImages {
          image(_id: "${this.id}") {
            image
          }
        }`
      }).valueChanges.subscribe({
        next: result => this.src.next(result.data.image.image),
        error: () => this.src.next('assets/svg/RöSeNa.svg')
      }));
    } else if (this.dynamicId) {
      this.subs.push(this.dynamicId
        .subscribe({
          next: (id) => {
            this.src.next(undefined);
            this.subs.push(this.apollo.watchQuery<{ image: Image }>({
              query: gql`
                query GetImages {
                  image(_id: "${id}") {
                    image
                  }
                }`
            }).valueChanges.subscribe({
              next: result => {
                if (!result.errors && result.data) {
                  this.src.next(result.data.image.image);
                }
              }
            }));
          },
          error: () => this.src.next('assets/svg/RöSeNa.svg')
        })
      );
    }
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
