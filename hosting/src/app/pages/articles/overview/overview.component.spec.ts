import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { OverviewComponent } from "./overview.component";
import { AuthService } from "src/app/services/auth.service";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";
import { AuthServiceStub, ArticleCardStub, ActivatedRouteStub, ArticleDalStub } from "src/app/testing";

describe("Articles-OverviewComponent", () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  const authStub = new AuthServiceStub();
  const activatedRouteStub = new ActivatedRouteStub();
  const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
  const articleStub = new ArticleDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        NoopAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatGridListModule,
        MatPaginatorModule,
        MatProgressBarModule,
      ],
      declarations: [OverviewComponent, ArticleCardStub],
      providers: [
        { provide: ArticleDalService, useValue: articleStub },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
