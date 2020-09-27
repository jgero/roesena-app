import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartPageComponent } from './start-page.component';
import { EventDALService } from 'src/app/services/DAL/event-dal.service';
import { EventDalStub } from 'src/app/testing';
import { ArticleDalStub } from 'src/app/testing';
import { ArticleDalService } from 'src/app/services/DAL/article-dal.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { ArticleCardStubComponent } from 'src/app/testing';
import { EventCardStubComponent } from 'src/app/testing';

describe('StartPageComponent', () => {
  let component: StartPageComponent;
  let fixture: ComponentFixture<StartPageComponent>;

  const eventDalStub = new EventDalStub();
  const articleDalStub = new ArticleDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatButtonModule, RouterTestingModule],
      declarations: [StartPageComponent, ArticleCardStubComponent, EventCardStubComponent],
      providers: [
        { provide: EventDALService, useValue: eventDalStub },
        { provide: ArticleDalService, useValue: articleDalStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
