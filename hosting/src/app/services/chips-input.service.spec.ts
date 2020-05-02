import { TestBed } from "@angular/core/testing";

import { ChipsInputService } from "./chips-input.service";
import { FormGroup, FormControl } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";

describe("ChipsInputService", () => {
  let service: ChipsInputService;
  let formGroup: FormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChipsInputService);
    formGroup = new FormGroup({ groups: new FormControl(["group 1"]) });
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should remove item", () => {
    service.removeItem("group 1", formGroup.get("groups"));
    expect(formGroup.get("groups").value).toEqual([]);
  });

  it("should add an item", () => {
    service.addItem({ value: " group 2  ", input: { value: "" } } as MatChipInputEvent, formGroup.get("groups"));
    expect(formGroup.get("groups").value.length).toBe(2);
    expect(formGroup.get("groups").value.includes("group 2")).toBeTrue();
    expect(formGroup.get("groups").value.includes("group 1")).toBeTrue();
  });

  it("should not add duplicates", () => {
    service.addItem({ value: " group 1", input: { value: "" } } as MatChipInputEvent, formGroup.get("groups"));
    expect(formGroup.get("groups").value.length).toBe(1);
  });
});
