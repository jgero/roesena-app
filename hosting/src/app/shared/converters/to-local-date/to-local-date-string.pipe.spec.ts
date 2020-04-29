import { ToLocalDateStringPipe } from "./to-local-date-string.pipe";

xdescribe("ToLocalDateStringPipe", () => {
  it("create an instance", () => {
    const pipe = new ToLocalDateStringPipe();
    expect(pipe).toBeTruthy();
  });
});
