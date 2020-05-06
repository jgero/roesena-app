import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ArticleCardComponent } from './article-card.component';
import { ConvertersModule } from '../../converters/converters.module';
import { AuthService } from 'src/app/services/auth.service';
import { AuthServiceStub } from 'src/app/testing';

describe('ArticleCardComponent', () => {
  let component: ArticleCardComponent;
  let fixture: ComponentFixture<ArticleCardComponent>;

  const authStub = new AuthServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleCardComponent],
      providers: [{ provide: AuthService, useValue: authStub }],
      imports: [ConvertersModule, MatCardModule, MatChipsModule, MatButtonModule, MatIconModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleCardComponent);
    component = fixture.componentInstance;
    component.data = {
      id: 'asdf',
      title: 'test',
      content: 'asdf',
      created: new Date(2020, 5, 10),
      ownerId: 'asdfasdfasdf',
      ownerName: 'Max Mustermann',
      tags: ['test', 'tags', 'and', 'stuff'],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
