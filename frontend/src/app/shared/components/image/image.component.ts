import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ImageService } from '../../services/image.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

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
  private sub: Subscription;

  public src = new BehaviorSubject<string>(undefined);

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    if (this.id) {
      this.apollo.watchQuery({
        query: gql`
        query GetImages {
          image(_id: "${this.id}") {
            image
          }
        }`
      }).valueChanges.subscribe({
        next: (result: any) => {
          if (!result.errors && result.data) {
            this.src.next(result.data.image.image);
          }
        },
        error: () => this.src.next('assets/svg/RöSeNa.svg')
      });
    } else if (this.dynamicId) {
      this.sub = this.dynamicId.subscribe({
        next: (id) => {
          this.src.next(undefined);
          this.apollo.watchQuery({
            query: gql`
            query GetImages {
              image(_id: "${id}") {
                image
              }
            }`
          }).valueChanges.subscribe({
            next: (result: any) => {
              if (!result.errors && result.data) {
                this.src.next(result.data.image.image);
              }
            }
          });
        },
        error: () => this.src.next('assets/svg/RöSeNa.svg')
      });
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
