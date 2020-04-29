import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CommonComponent } from "./common.component";
import { ActivatedRouteStub } from "src/app/testing";
import { ImageDalStub } from "src/app/testing";
import { ArticleDalStub } from "src/app/testing";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";
import { ActivatedRoute } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Component } from "@angular/core";

@Component({ selector: "app-image-card", template: "" })
class a {}
@Component({ selector: "app-markdown-viewer", template: "" })
class b {}

xdescribe("CommonComponent", () => {
  let component: CommonComponent;
  let fixture: ComponentFixture<CommonComponent>;

  const activatedRouteStub = new ActivatedRouteStub(null, { groupName: "asdf", externalPageLink: "teest" });
  const imageStub = new ImageDalStub();
  const articleStub = new ArticleDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatToolbarModule, MatButtonModule, MatIconModule],
      declarations: [CommonComponent, a, b],
      providers: [
        { provide: ImageDalService, useValue: imageStub },
        { provide: ArticleDalService, useValue: articleStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
