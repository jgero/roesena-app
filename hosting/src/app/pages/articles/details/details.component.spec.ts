import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { DetailsComponent } from "./details.component";
import { ConvertersModule } from "src/app/shared/converters/converters.module";

import { ArticleDalService } from "src/app/services/DAL/article-dal.service";
import { AuthService } from "src/app/services/auth.service";
import { ActivatedRouteStub, MarkdownViewerStub, ArticleDalStub, AuthServiceStub, testingRoutes } from "src/app/testing";

describe("Articles-DetailsComponent", () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  const activatedRouteStub = new ActivatedRouteStub({ id: "12341234" });
  const articleDalStub = new ArticleDalStub();
  const authServiceStub = new AuthServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatChipsModule,
        MatProgressBarModule,
        MatButtonModule,
        MatIconModule,
        ConvertersModule,
        RouterTestingModule.withRoutes(testingRoutes),
      ],
      declarations: [DetailsComponent, MarkdownViewerStub],
      providers: [
        { provide: ArticleDalService, useValue: articleDalStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    activatedRouteStub.setParamMap({ id: "12341234" });
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
