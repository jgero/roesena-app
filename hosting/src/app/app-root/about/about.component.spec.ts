import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AboutComponent } from "./about.component";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { ImageDalStub } from "src/app/testing/stubs/image-dal";

describe("AboutComponent", () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  const imageDalStub = new ImageDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AboutComponent],
      providers: [{ provide: ImageDalService, useValue: imageDalStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
