import { ToLocalDateStringPipe } from "./to-local-date-string.pipe";

describe("ToLocalDateStringPipe", () => {
  let pipe: ToLocalDateStringPipe;

  beforeEach(() => {
    pipe = new ToLocalDateStringPipe();
  });

  it("create an instance", () => {
    const p = new ToLocalDateStringPipe();
    expect(p).toBeTruthy();
  });

  it("should transform a date object into a string", () => {
    expect(pipe.transform(new Date(2020, 5, 1))).toEqual("01.06.2020");
  });
});
