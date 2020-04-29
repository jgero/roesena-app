import { ToLocalTimeStringPipe } from "./to-local-time-string.pipe";

describe("ToLocalTimeStringPipe", () => {
  let pipe: ToLocalTimeStringPipe;

  beforeEach(() => {
    pipe = new ToLocalTimeStringPipe();
  });

  it("create an instance", () => {
    const p = new ToLocalTimeStringPipe();
    expect(p).toBeTruthy();
  });

  it("should transform a date object into a string", () => {
    const d = new Date();
    d.setHours(4, 12);
    expect(pipe.transform(d)).toEqual("04:12");
    d.setHours(15, 30);
    expect(pipe.transform(d)).toEqual("15:30");
  });
});
