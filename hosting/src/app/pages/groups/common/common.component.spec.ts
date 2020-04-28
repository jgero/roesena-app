import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CommonComponent } from "./common.component";
import { ActivatedRouteStub } from "src/app/testing/stubs/activated-route";
import { ImageDalStub } from "src/app/testing/stubs/image-dal";
import { ArticleDalStub } from "src/app/testing/stubs/article-dal";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";
import { ActivatedRoute } from "@angular/router";

describe("CommonComponent", () => {
  let component: CommonComponent;
  let fixture: ComponentFixture<CommonComponent>;

  const activatedRouteStub = new ActivatedRouteStub(null, { groupName: "asdf", externalPageLink: "teest" });
  const imageStub = new ImageDalStub();
  const articleStub = new ArticleDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommonComponent],
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
